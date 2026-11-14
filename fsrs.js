// FSRS-5 (Free Spaced Repetition Scheduler v5) implementation
// Ratings: 1 = Again ("Not at all"), 2 = Hard ("Approximately"), 3 = Good ("Well")

const W = [
  0.40255,  // w0: initial stability for Again
  1.18385,  // w1: initial stability for Hard
  3.173,    // w2: initial stability for Good
  15.69105, // w3: initial stability for Easy (reference for D0(4))
  7.1949,   // w4: initial difficulty base
  0.5345,   // w5: initial difficulty exponent
  1.4604,   // w6: difficulty delta factor
  0.0046,   // w7: difficulty mean reversion weight
  1.54575,  // w8: recall stability gain base
  0.1192,   // w9: recall stability saturation exponent
  1.01925,  // w10: recall retrievability exponent
  1.9395,   // w11: forget stability base
  0.11,     // w12: forget difficulty exponent
  0.29605,  // w13: forget stability exponent
  2.2698,   // w14: forget retrievability exponent
  0.2315,   // w15: Hard penalty multiplier
  2.9898,   // w16: Easy bonus (unused in 3-button mode)
  0.51655,  // w17: short-term (same-day) stability factor
  0.6621    // w18: short-term rating offset
];

const DECAY = -0.5;
const FACTOR = 19 / 81; // Ensures R(t = S, S) = 0.90
const REQUEST_RETENTION = 0.90;
const DAY_MS = 86_400_000;
const AGAIN_RELEARN_MS = 10 * 60 * 1000; // 10 minutes before due again

function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}

function initDifficulty(rating) {
  return clamp(W[4] - Math.exp(W[5] * (rating - 1)) + 1, 1, 10);
}

function nextDifficulty(d, rating) {
  const deltaD = -W[6] * (rating - 3);
  const damped = d + deltaD * ((10 - d) / 9);
  const d0Easy = initDifficulty(4);
  return clamp(W[7] * d0Easy + (1 - W[7]) * damped, 1, 10);
}

export function getRetrievability(card, now = Date.now()) {
  if (!card.reps || !card.stability || !card.lastReviewAt) {
    return 0;
  }
  const elapsedDays = Math.max(0, (now - card.lastReviewAt) / DAY_MS);
  return Math.pow(1 + FACTOR * (elapsedDays / card.stability), DECAY);
}

function stabilityToIntervalDays(stability) {
  const raw = (stability / FACTOR) * (Math.pow(REQUEST_RETENTION, 1 / DECAY) - 1);
  return Math.max(0.05, raw);
}

/**
 * Computes updated FSRS-5 fields for a card given rating in {1, 2, 3}.
 * 1 = Not at all (Again), 2 = Approximately (Hard), 3 = Well (Good)
 */
export function reviewCard(card, rating, now = Date.now()) {
  const reps = card.reps || 0;
  let stability = card.stability || 0;
  let difficulty = card.difficulty || 0;
  let lapses = card.lapses || 0;

  if (reps === 0) {
    // First-ever review of an unseen card
    stability = W[rating - 1];
    difficulty = initDifficulty(rating);
    if (rating === 1) {
      lapses += 1;
    }
  } else {
    const elapsedDays = Math.max(0, (now - (card.lastReviewAt || now)) / DAY_MS);
    difficulty = nextDifficulty(difficulty, rating);

    if (elapsedDays < 1) {
      // FSRS-5 short-term (same-day) stability update
      const sNew = stability * Math.exp(W[17] * (rating - 3 + W[18]));
      stability = rating === 1 ? Math.min(stability, Math.max(0.1, sNew)) : Math.max(0.1, sNew);
      if (rating === 1) {
        lapses += 1;
      }
    } else {
      const r = getRetrievability(card, now);
      if (rating === 1) {
        // Lapse / forgotten
        lapses += 1;
        const sForget =
          W[11] *
          Math.pow(difficulty, -W[12]) *
          (Math.pow(stability + 1, W[13]) - 1) *
          Math.exp(W[14] * (1 - r));
        stability = clamp(sForget, 0.1, stability);
      } else {
        // Successful recall (Hard = 2, Good = 3)
        const hardPenalty = rating === 2 ? W[15] : 1;
        const gain =
          Math.exp(W[8]) *
          (11 - difficulty) *
          Math.pow(stability, -W[9]) *
          (Math.exp(W[10] * (1 - r)) - 1) *
          hardPenalty;
        stability = Math.max(0.1, stability * (1 + gain));
      }
    }
  }

  const dueAt =
    rating === 1
      ? now + AGAIN_RELEARN_MS
      : now + stabilityToIntervalDays(stability) * DAY_MS;

  return {
    ...card,
    stability: Number(stability.toFixed(4)),
    difficulty: Number(difficulty.toFixed(4)),
    reps: reps + 1,
    lapses,
    lastReviewAt: now,
    dueAt: Math.round(dueAt)
  };
}

/**
 * Continuous mastery score in [0, 1] for the knowledge distribution curve.
 * Combines FSRS stability (long-term durability, 90+ days = full mastery)
 * with current retrievability so neglected cards gently drift leftward.
 */
export function getMasteryScore(card, now = Date.now()) {
  if (!card.reps || !card.stability) {
    return 0.03;
  }
  const r = getRetrievability(card, now);
  const effectiveStability = card.stability * r;
  const normalized = Math.log1p(effectiveStability) / Math.log1p(90);
  return clamp(0.06 + 0.91 * normalized, 0.04, 0.97);
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Selects up to `sessionSize` (20) cards with a balanced target of:
 * - up to 5 unseen cards
 * - up to 15 due cards (lowest retrievability first)
 * Backfills from remaining due, then remaining unseen, then soonest/weakest ahead cards.
 */
export function buildRevisionSession(allCards, sessionSize = 20, now = Date.now()) {
  if (!allCards.length) return [];

  const targetTotal = Math.min(sessionSize, allCards.length);
  const unseen = [];
  const due = [];
  const ahead = [];

  for (const card of allCards) {
    if (!card.reps) {
      unseen.push(card);
    } else if ((card.dueAt || 0) <= now) {
      due.push(card);
    } else {
      ahead.push(card);
    }
  }

  const shuffledUnseen = shuffle(unseen);
  due.sort((a, b) => getRetrievability(a, now) - getRetrievability(b, now));
  ahead.sort((a, b) => {
    const rDiff = getRetrievability(a, now) - getRetrievability(b, now);
    if (Math.abs(rDiff) > 0.001) return rDiff;
    return (a.dueAt || 0) - (b.dueAt || 0);
  });

  const selected = [];
  const targetNew = Math.min(5, shuffledUnseen.length);
  const targetDue = Math.min(targetTotal - targetNew, due.length);

  selected.push(...shuffledUnseen.slice(0, targetNew));
  selected.push(...due.slice(0, targetDue));

  // Backfill if slots remain
  let remDueIdx = targetDue;
  while (selected.length < targetTotal && remDueIdx < due.length) {
    selected.push(due[remDueIdx++]);
  }

  let remNewIdx = targetNew;
  while (selected.length < targetTotal && remNewIdx < shuffledUnseen.length) {
    selected.push(shuffledUnseen[remNewIdx++]);
  }

  let aheadIdx = 0;
  while (selected.length < targetTotal && aheadIdx < ahead.length) {
    selected.push(ahead[aheadIdx++]);
  }

  return shuffle(selected).map((card) => ({
    card,
    direction: Math.random() < 0.5 ? 'de-to-tr' : 'tr-to-de'
  }));
}
