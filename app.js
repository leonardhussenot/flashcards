import {
  requestPersistentStorage,
  getAllCards,
  upsertCardPairs,
  saveCard,
  deleteCard,
  importBackupCards,
  cleanText
} from './db.js';

import {
  reviewCard,
  getMasteryScore,
  buildRevisionSession
} from './fsrs.js';

import { GRAMMAR_PAGES } from './grammar.js';
import { filterAndSortCards } from './dictionary.js';

const AI_EXTRACTION_PROMPT = `Analyze this German image or text and extract vocabulary for flashcards.

- If the source is already a vocabulary list, extract all entries.
- If the source is a full page of prose, dialogue, or an article, be selective: extract ONLY the salient, high-value words, collocations, and idiomatic expressions worth learning (skip basic filler words, proper names, and trivial grammar words). Convert conjugated verbs or declined nouns from the text into their clean base dictionary form.

Output ONLY the extracted pairs, one per line, in this exact format:
German | Translation

Rules:
- For German nouns, always include the definite article (der, die, das).
- For verbs with fixed prepositions or reflexive forms, include them (e.g. sich erinnern an).
- If translations are already present in the source, keep them; otherwise translate into natural French or English matching the context.
- Output nothing else: no numbering, bullet points, headers, explanations, or markdown code blocks.`;

// DOM references
const views = {
  menu: document.getElementById('view-menu'),
  dictionary: document.getElementById('view-dictionary'),
  grammar: document.getElementById('view-grammar'),
  addOne: document.getElementById('view-add-one'),
  batch: document.getElementById('view-batch'),
  revise: document.getElementById('view-revise'),
  complete: document.getElementById('view-complete')
};

const deckCountEl = document.getElementById('deck-count');
const curveAreaEl = document.getElementById('curve-area');
const curveLineEl = document.getElementById('curve-line');
const menuStatusEl = document.getElementById('menu-status');

const btnGoRevise = document.getElementById('btn-go-revise');
const btnGoDictionary = document.getElementById('btn-go-dictionary');
const btnGoGrammar = document.getElementById('btn-go-grammar');
const btnGoAddOne = document.getElementById('btn-go-add-one');
const btnGoBatch = document.getElementById('btn-go-batch');
const btnCopyPrompt = document.getElementById('btn-copy-prompt');
const btnExport = document.getElementById('btn-export');
const btnImport = document.getElementById('btn-import');
const fileImport = document.getElementById('file-import');

// Dictionary DOM
const dictCountEl = document.getElementById('dict-count');
const inputDictSearch = document.getElementById('input-dict-search');
const btnDictClear = document.getElementById('btn-dict-clear');
const dictScrollEl = document.getElementById('dict-scroll');
const dictListEl = document.getElementById('dict-list');
const dictSentinelEl = document.getElementById('dict-sentinel');
const dictEmptyEl = document.getElementById('dict-empty');

const dictEditOverlayEl = document.getElementById('dict-edit-overlay');
const formDictEdit = document.getElementById('form-dict-edit');
const dictEditGermanInput = document.getElementById('dict-edit-german');
const dictEditTranslationInput = document.getElementById('dict-edit-translation');
const btnDictDelete = document.getElementById('btn-dict-delete');
const btnDictConfirmDelete = document.getElementById('btn-dict-confirm-delete');
const btnDictCancel = document.getElementById('btn-dict-cancel');

// Grammar DOM
const grammarPageTitleEl = document.getElementById('grammar-page-title');
const grammarCounterEl = document.getElementById('grammar-counter');
const grammarTrackEl = document.getElementById('grammar-track');
const grammarDotsEl = document.getElementById('grammar-dots');
const btnGrammarPrev = document.getElementById('btn-grammar-prev');
const btnGrammarNext = document.getElementById('btn-grammar-next');

// Add / Batch DOM
const formAddOne = document.getElementById('form-add-one');
const inputGerman = document.getElementById('input-german');
const inputTranslation = document.getElementById('input-translation');
const addOneStatus = document.getElementById('add-one-status');

const formBatch = document.getElementById('form-batch');
const inputBatch = document.getElementById('input-batch');
const btnBatchPaste = document.getElementById('btn-batch-paste');
const batchStatus = document.getElementById('batch-status');

// Revise DOM
const reviseCounterEl = document.getElementById('revise-counter');
const flashcardEl = document.getElementById('flashcard');
const flashcardInnerEl = document.getElementById('flashcard-inner');
const cardFrontEl = document.getElementById('card-front');
const cardBackEl = document.getElementById('card-back');
const cardFrontTextEl = document.getElementById('card-front-text');
const cardBackTextEl = document.getElementById('card-back-text');
const ratingBarEl = document.getElementById('rating-bar');

const cardToolsEl = document.getElementById('card-tools');
const cardToolsDefaultEl = document.getElementById('card-tools-default');
const cardToolsConfirmEl = document.getElementById('card-tools-confirm');
const btnEditCard = document.getElementById('btn-edit-card');
const btnDeleteCard = document.getElementById('btn-delete-card');
const btnConfirmDelete = document.getElementById('btn-confirm-delete');
const btnCancelDelete = document.getElementById('btn-cancel-delete');

const editOverlayEl = document.getElementById('edit-overlay');
const formEditCard = document.getElementById('form-edit-card');
const editGermanInput = document.getElementById('edit-german');
const editTranslationInput = document.getElementById('edit-translation');
const btnCancelEdit = document.getElementById('btn-cancel-edit');

const completeTitleEl = document.getElementById('complete-title');
const sumWellEl = document.getElementById('sum-well');
const sumApproxEl = document.getElementById('sum-approx');
const sumNotEl = document.getElementById('sum-not');
const btnFinishSession = document.getElementById('btn-finish-session');

// State
let allCards = [];
let sessionQueue = [];
let sessionIndex = 0;
let isCardFlipped = false;
let hasRevealedCurrent = false;
let isAdvancing = false;
let sessionStats = { well: 0, approx: 0, not: 0 };
let statusTimer = null;

// Dictionary state
const DICT_CHUNK_SIZE = 100;
let dictFilteredCards = [];
let dictRenderedCount = 0;
let dictEditingCard = null;

// Grammar state
let currentGrammarPage = 0;

function showView(name) {
  for (const [key, el] of Object.entries(views)) {
    el.classList.toggle('is-active', key === name);
  }
}

function showMenuStatus(msg) {
  menuStatusEl.textContent = msg;
  if (statusTimer) clearTimeout(statusTimer);
  if (msg) {
    statusTimer = setTimeout(() => {
      menuStatusEl.textContent = '';
    }, 3200);
  }
}

/**
 * Renders a smooth Gaussian Kernel Density Estimate (KDE) curve over [0, 1]
 * showing card mastery from low (left) to high (right).
 */
function renderKnowledgeCurve(cards) {
  const count = cards.length;
  deckCountEl.textContent = count === 1 ? '1 card' : `${count} cards`;
  btnGoRevise.disabled = count === 0;

  if (count === 0) {
    curveAreaEl.setAttribute('d', '');
    curveLineEl.setAttribute('d', '');
    return;
  }

  const now = Date.now();
  const scores = cards.map((c) => getMasteryScore(c, now));

  const xStart = 10;
  const xEnd = 310;
  const yBase = 82;
  const maxHeight = 66;
  const steps = 76;
  const bandwidth = 0.085;
  const invTwoSigmaSq = 1 / (2 * bandwidth * bandwidth);

  const densities = [];
  let maxDensity = 0;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    let sum = 0;
    for (let j = 0; j < scores.length; j++) {
      const diff = t - scores[j];
      sum += Math.exp(-(diff * diff) * invTwoSigmaSq);
    }
    densities.push(sum);
    if (sum > maxDensity) maxDensity = sum;
  }

  if (maxDensity <= 0) {
    curveAreaEl.setAttribute('d', '');
    curveLineEl.setAttribute('d', '');
    return;
  }

  const points = densities.map((d, i) => {
    const x = xStart + (i / steps) * (xEnd - xStart);
    const y = yBase - (d / maxDensity) * maxHeight;
    return [x, y];
  });

  const lineParts = points.map(
    ([x, y], idx) => `${idx === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
  );
  const linePath = lineParts.join(' ');
  const areaPath = `${linePath} L${xEnd},${yBase} L${xStart},${yBase} Z`;

  curveLineEl.setAttribute('d', linePath);
  curveAreaEl.setAttribute('d', areaPath);
}

async function refreshMenu() {
  allCards = await getAllCards();
  renderKnowledgeCurve(allCards);
}

// --- DICTIONARY VIEW (SCROLL & SEARCH) ---

function createDictRow(card) {
  const row = document.createElement('button');
  row.type = 'button';
  row.className = 'dict-row';
  row.setAttribute('role', 'listitem');

  const deSpan = document.createElement('span');
  deSpan.className = 'dict-de';
  deSpan.textContent = card.german;

  const trSpan = document.createElement('span');
  trSpan.className = 'dict-tr';
  trSpan.textContent = card.translation;

  row.appendChild(deSpan);
  row.appendChild(trSpan);

  row.addEventListener('click', () => openDictEditOverlay(card));
  return row;
}

function appendNextDictChunk() {
  if (dictRenderedCount >= dictFilteredCards.length) return;

  const end = Math.min(
    dictRenderedCount + DICT_CHUNK_SIZE,
    dictFilteredCards.length
  );
  const frag = document.createDocumentFragment();
  for (let i = dictRenderedCount; i < end; i++) {
    frag.appendChild(createDictRow(dictFilteredCards[i]));
  }
  dictListEl.appendChild(frag);
  dictRenderedCount = end;
}

function updateDictionaryList(resetScroll = true) {
  const query = inputDictSearch.value;
  const hasQuery = query.trim().length > 0;
  btnDictClear.classList.toggle('is-gone', !hasQuery);

  dictFilteredCards = filterAndSortCards(allCards, query);
  dictListEl.textContent = '';
  dictRenderedCount = 0;

  if (allCards.length === 0) {
    dictCountEl.textContent = '0';
    dictEmptyEl.textContent = 'No cards yet';
    dictEmptyEl.classList.remove('is-gone');
    return;
  }

  dictCountEl.textContent = hasQuery
    ? `${dictFilteredCards.length} / ${allCards.length}`
    : `${allCards.length}`;

  if (dictFilteredCards.length === 0) {
    dictEmptyEl.textContent = 'No matching cards';
    dictEmptyEl.classList.remove('is-gone');
    return;
  }

  dictEmptyEl.classList.add('is-gone');
  if (resetScroll) {
    dictScrollEl.scrollTop = 0;
  }
  appendNextDictChunk();
  while (
    dictScrollEl.clientHeight > 0 &&
    dictRenderedCount < dictFilteredCards.length &&
    dictScrollEl.scrollHeight <= dictScrollEl.clientHeight + 280
  ) {
    appendNextDictChunk();
  }
}

async function openDictionaryView() {
  allCards = await getAllCards();
  inputDictSearch.value = '';
  closeDictEditOverlay();
  showView('dictionary');
  updateDictionaryList(true);
}

dictScrollEl.addEventListener(
  'scroll',
  () => {
    if (
      dictRenderedCount < dictFilteredCards.length &&
      dictScrollEl.scrollTop + dictScrollEl.clientHeight >=
        dictScrollEl.scrollHeight - 320
    ) {
      appendNextDictChunk();
    }
  },
  { passive: true }
);

const dictObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        appendNextDictChunk();
      }
    }
  },
  { root: dictScrollEl, rootMargin: '280px' }
);
dictObserver.observe(dictSentinelEl);

inputDictSearch.addEventListener('input', () => {
  updateDictionaryList(true);
});

btnDictClear.addEventListener('click', () => {
  inputDictSearch.value = '';
  updateDictionaryList(true);
  inputDictSearch.focus();
});

function resetDictDeleteConfirm() {
  btnDictDelete.classList.remove('is-gone');
  btnDictConfirmDelete.classList.add('is-gone');
}

function openDictEditOverlay(card) {
  dictEditingCard = card;
  dictEditGermanInput.value = card.german;
  dictEditTranslationInput.value = card.translation;
  resetDictDeleteConfirm();
  dictEditOverlayEl.classList.remove('is-hidden');
}

function closeDictEditOverlay() {
  dictEditingCard = null;
  resetDictDeleteConfirm();
  dictEditOverlayEl.classList.add('is-hidden');
}

btnDictCancel.addEventListener('click', closeDictEditOverlay);
dictEditOverlayEl.addEventListener('click', (e) => {
  if (e.target === dictEditOverlayEl) {
    closeDictEditOverlay();
  }
});

btnDictDelete.addEventListener('click', () => {
  btnDictDelete.classList.add('is-gone');
  btnDictConfirmDelete.classList.remove('is-gone');
});

btnDictConfirmDelete.addEventListener('click', async () => {
  if (!dictEditingCard) return;
  const scrollPos = dictScrollEl.scrollTop;
  await deleteCard(dictEditingCard.id);
  allCards = await getAllCards();
  closeDictEditOverlay();
  updateDictionaryList(false);
  dictScrollEl.scrollTop = scrollPos;
});

formDictEdit.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!dictEditingCard) return;

  const german = cleanText(dictEditGermanInput.value);
  const translation = cleanText(dictEditTranslationInput.value);
  if (!german || !translation) return;

  const scrollPos = dictScrollEl.scrollTop;
  await saveCard({
    ...dictEditingCard,
    german,
    translation
  });
  allCards = await getAllCards();
  closeDictEditOverlay();
  updateDictionaryList(false);
  dictScrollEl.scrollTop = scrollPos;
});

// --- GRAMMAR CHEAT SHEET (5 SWIPEABLE PAGES) ---

function initGrammarCheatSheet() {
  grammarTrackEl.textContent = '';
  grammarDotsEl.textContent = '';

  GRAMMAR_PAGES.forEach((page, idx) => {
    const slide = document.createElement('article');
    slide.className = 'grammar-slide';
    slide.setAttribute('aria-label', page.title);
    slide.innerHTML = page.html;
    grammarTrackEl.appendChild(slide);

    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'grammar-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `${idx + 1}. ${page.title}`);
    dot.addEventListener('click', () => goToGrammarPage(idx, true));
    grammarDotsEl.appendChild(dot);
  });

  updateGrammarHeader(0);
}

function updateGrammarHeader(idx) {
  const total = GRAMMAR_PAGES.length;
  const safeIdx = Math.max(0, Math.min(total - 1, idx));
  currentGrammarPage = safeIdx;

  grammarPageTitleEl.textContent = GRAMMAR_PAGES[safeIdx].title;
  grammarCounterEl.textContent = `${safeIdx + 1} / ${total}`;
  btnGrammarPrev.disabled = safeIdx === 0;
  btnGrammarNext.disabled = safeIdx === total - 1;

  const dots = grammarDotsEl.children;
  for (let i = 0; i < dots.length; i++) {
    const active = i === safeIdx;
    dots[i].classList.toggle('is-active', active);
    dots[i].setAttribute('aria-selected', String(active));
  }
}

function goToGrammarPage(idx, smooth = true) {
  const total = GRAMMAR_PAGES.length;
  const safeIdx = Math.max(0, Math.min(total - 1, idx));
  const width = grammarTrackEl.clientWidth;
  updateGrammarHeader(safeIdx);
  if (smooth) {
    grammarTrackEl.scrollTo({ left: safeIdx * width, behavior: 'smooth' });
  } else {
    grammarTrackEl.scrollLeft = safeIdx * width;
  }
}

let grammarScrollRaf = null;
grammarTrackEl.addEventListener('scroll', () => {
  if (grammarScrollRaf) return;
  grammarScrollRaf = requestAnimationFrame(() => {
    grammarScrollRaf = null;
    const width = grammarTrackEl.clientWidth;
    if (width > 0) {
      const idx = Math.round(grammarTrackEl.scrollLeft / width);
      if (idx !== currentGrammarPage) {
        updateGrammarHeader(idx);
      }
    }
  });
});

btnGrammarPrev.addEventListener('click', () => {
  goToGrammarPage(currentGrammarPage - 1, true);
});

btnGrammarNext.addEventListener('click', () => {
  goToGrammarPage(currentGrammarPage + 1, true);
});

function openGrammarView() {
  showView('grammar');
  requestAnimationFrame(() => {
    goToGrammarPage(currentGrammarPage, false);
  });
}

// --- REVISION FLOW ---

function applyTextSizing(el, text) {
  el.textContent = text;
  el.classList.toggle('is-long', text.length > 42);
}

function resetDeleteConfirm() {
  cardToolsDefaultEl.classList.remove('is-hidden');
  cardToolsConfirmEl.classList.add('is-hidden');
}

function renderCurrentSessionCard() {
  const item = sessionQueue[sessionIndex];
  if (!item) {
    finishRevisionSession();
    return;
  }

  const { card, direction } = item;
  const frontIsGerman = direction === 'de-to-tr';

  const frontText = frontIsGerman ? card.german : card.translation;
  const backText = frontIsGerman ? card.translation : card.german;

  // Prevent flip-back animation from flashing the next card's back face
  flashcardInnerEl.classList.add('no-transition');
  flashcardInnerEl.classList.remove('is-flipped');

  cardFrontEl.classList.toggle('face-german', frontIsGerman);
  cardFrontEl.classList.toggle('face-translation', !frontIsGerman);
  cardBackEl.classList.toggle('face-german', !frontIsGerman);
  cardBackEl.classList.toggle('face-translation', frontIsGerman);

  applyTextSizing(cardFrontTextEl, frontText);
  applyTextSizing(cardBackTextEl, backText);

  // Force synchronous reflow before re-enabling 3D flip transition
  void flashcardInnerEl.offsetWidth;
  flashcardInnerEl.classList.remove('no-transition');

  isCardFlipped = false;
  hasRevealedCurrent = false;
  isAdvancing = false;

  ratingBarEl.classList.add('is-hidden');
  cardToolsEl.classList.add('is-hidden');
  resetDeleteConfirm();

  reviseCounterEl.textContent = `${sessionIndex + 1} / ${sessionQueue.length}`;
}

async function startRevisionSession() {
  allCards = await getAllCards();
  if (!allCards.length) return;

  sessionQueue = buildRevisionSession(allCards, 20);
  sessionIndex = 0;
  sessionStats = { well: 0, approx: 0, not: 0 };

  showView('revise');
  renderCurrentSessionCard();
}

function flipCurrentCard() {
  if (isAdvancing || !sessionQueue[sessionIndex]) return;
  isCardFlipped = !isCardFlipped;
  flashcardInnerEl.classList.toggle('is-flipped', isCardFlipped);

  if (!hasRevealedCurrent && isCardFlipped) {
    hasRevealedCurrent = true;
    ratingBarEl.classList.remove('is-hidden');
    cardToolsEl.classList.remove('is-hidden');
  }
}

async function handleRateCard(rating) {
  if (!hasRevealedCurrent || isAdvancing) return;
  const current = sessionQueue[sessionIndex];
  if (!current) return;

  isAdvancing = true;

  if (rating === 3) sessionStats.well += 1;
  else if (rating === 2) sessionStats.approx += 1;
  else sessionStats.not += 1;

  const updated = reviewCard(current.card, rating, Date.now());
  await saveCard(updated);

  sessionIndex += 1;
  if (sessionIndex >= sessionQueue.length) {
    finishRevisionSession();
  } else {
    renderCurrentSessionCard();
  }
}

function finishRevisionSession() {
  const totalAnswered =
    sessionStats.well + sessionStats.approx + sessionStats.not;

  if (totalAnswered === 0) {
    refreshMenu().then(() => showView('menu'));
    return;
  }

  completeTitleEl.textContent =
    totalAnswered === 1 ? '1 card reviewed' : `${totalAnswered} cards reviewed`;
  sumWellEl.textContent = String(sessionStats.well);
  sumApproxEl.textContent = String(sessionStats.approx);
  sumNotEl.textContent = String(sessionStats.not);

  showView('complete');
}

// --- INLINE CARD EDIT & DELETE DURING REVISION ---

function openEditOverlay() {
  const current = sessionQueue[sessionIndex];
  if (!current) return;
  editGermanInput.value = current.card.german;
  editTranslationInput.value = current.card.translation;
  editOverlayEl.classList.remove('is-hidden');
  editGermanInput.focus();
}

function closeEditOverlay() {
  editOverlayEl.classList.add('is-hidden');
}

formEditCard.addEventListener('submit', async (e) => {
  e.preventDefault();
  const current = sessionQueue[sessionIndex];
  if (!current) return;

  const german = cleanText(editGermanInput.value);
  const translation = cleanText(editTranslationInput.value);
  if (!german || !translation) return;

  const saved = await saveCard({
    ...current.card,
    german,
    translation
  });

  current.card = saved;
  const frontIsGerman = current.direction === 'de-to-tr';
  applyTextSizing(cardFrontTextEl, frontIsGerman ? saved.german : saved.translation);
  applyTextSizing(cardBackTextEl, frontIsGerman ? saved.translation : saved.german);

  closeEditOverlay();
});

btnEditCard.addEventListener('click', openEditOverlay);
btnCancelEdit.addEventListener('click', closeEditOverlay);

btnDeleteCard.addEventListener('click', () => {
  cardToolsDefaultEl.classList.add('is-hidden');
  cardToolsConfirmEl.classList.remove('is-hidden');
});

btnCancelDelete.addEventListener('click', resetDeleteConfirm);

btnConfirmDelete.addEventListener('click', async () => {
  const current = sessionQueue[sessionIndex];
  if (!current || isAdvancing) return;
  isAdvancing = true;

  await deleteCard(current.card.id);
  sessionQueue.splice(sessionIndex, 1);

  if (sessionIndex >= sessionQueue.length) {
    finishRevisionSession();
  } else {
    renderCurrentSessionCard();
  }
});

// --- ADD ONE CARD ---

formAddOne.addEventListener('submit', async (e) => {
  e.preventDefault();
  const german = cleanText(inputGerman.value);
  const translation = cleanText(inputTranslation.value);
  if (!german || !translation) return;

  const { updated } = await upsertCardPairs([{ german, translation }]);
  inputGerman.value = '';
  inputTranslation.value = '';
  inputGerman.focus();

  addOneStatus.classList.remove('is-error');
  addOneStatus.textContent =
    updated > 0 ? `Updated "${german}"` : `Added "${german}"`;
});

// --- BATCH ADD CARDS ---

function parseBatchInput(rawText) {
  const lines = rawText
    .replace(/^```[\w-]*\s*/gm, '')
    .replace(/```$/gm, '')
    .split(/\r?\n/);

  const pairs = [];
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) continue;

    const sepIdx = trimmed.indexOf('|');
    if (sepIdx === -1) {
      return {
        error: `Line ${i + 1} is missing "|" (${trimmed.slice(0, 28)})`
      };
    }

    const german = cleanText(trimmed.slice(0, sepIdx));
    const translation = cleanText(trimmed.slice(sepIdx + 1));

    if (!german || !translation) {
      return {
        error: `Line ${i + 1} needs both German and Translation sides`
      };
    }

    pairs.push({ german, translation });
  }

  if (pairs.length === 0) {
    return { error: 'Paste at least one "German | Translation" line.' };
  }

  return { pairs };
}

btnBatchPaste.addEventListener('click', async () => {
  if (!navigator.clipboard || !navigator.clipboard.readText) {
    batchStatus.classList.add('is-error');
    batchStatus.textContent = 'Clipboard paste requires HTTPS or localhost';
    return;
  }

  try {
    const clipText = await navigator.clipboard.readText();
    const trimmed = clipText.trim();
    if (!trimmed) {
      batchStatus.classList.remove('is-error');
      batchStatus.textContent = 'Clipboard is empty';
      return;
    }

    const existing = inputBatch.value.trim();
    inputBatch.value = existing ? `${existing}\n${trimmed}` : trimmed;
    const lineCount = trimmed.split(/\r?\n/).filter((l) => l.trim()).length;
    batchStatus.classList.remove('is-error');
    batchStatus.textContent = `Pasted ${lineCount} ${lineCount === 1 ? 'line' : 'lines'}`;
  } catch {
    batchStatus.classList.add('is-error');
    batchStatus.textContent = 'Paste declined or unavailable';
  }
});

formBatch.addEventListener('submit', async (e) => {
  e.preventDefault();
  const parsed = parseBatchInput(inputBatch.value);

  if (parsed.error) {
    batchStatus.classList.add('is-error');
    batchStatus.textContent = parsed.error;
    return;
  }

  const { added, updated } = await upsertCardPairs(parsed.pairs);
  inputBatch.value = '';
  batchStatus.classList.remove('is-error');

  const parts = [];
  if (added > 0) parts.push(`Added ${added} ${added === 1 ? 'card' : 'cards'}`);
  if (updated > 0) parts.push(`updated ${updated} existing`);
  batchStatus.textContent = parts.join(' · ');
});

// --- COPY AI PROMPT ---

async function copyTextToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to legacy textarea copy
    }
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  const ok = document.execCommand('copy');
  document.body.removeChild(ta);
  return ok;
}

const iconPromptDefault = document.getElementById('icon-prompt-default');
const iconPromptCopied = document.getElementById('icon-prompt-copied');
let copyBtnTimer = null;

btnCopyPrompt.addEventListener('click', async () => {
  const ok = await copyTextToClipboard(AI_EXTRACTION_PROMPT);
  if (copyBtnTimer) clearTimeout(copyBtnTimer);

  if (ok) {
    iconPromptDefault.classList.add('is-gone');
    iconPromptCopied.classList.remove('is-gone');
    btnCopyPrompt.classList.add('btn-copied');
    showMenuStatus('Prompt copied');
  } else {
    showMenuStatus('Could not copy');
  }

  copyBtnTimer = setTimeout(() => {
    iconPromptDefault.classList.remove('is-gone');
    iconPromptCopied.classList.add('is-gone');
    btnCopyPrompt.classList.remove('btn-copied');
  }, 1800);
});

// --- JSON BACKUP EXPORT & IMPORT ---

btnExport.addEventListener('click', async () => {
  const cards = await getAllCards();
  if (!cards.length) {
    showMenuStatus('No cards to export yet');
    return;
  }

  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    cards
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json'
  });
  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `deutsch-cards-${dateStr}.json`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);

  showMenuStatus(`Exported ${cards.length} cards`);
});

btnImport.addEventListener('click', () => {
  fileImport.value = '';
  fileImport.click();
});

fileImport.addEventListener('change', async () => {
  const file = fileImport.files && fileImport.files[0];
  if (!file) return;

  try {
    const text = await file.text();
    const json = JSON.parse(text);
    const list = Array.isArray(json) ? json : json.cards;
    const { added, updated } = await importBackupCards(list);
    await refreshMenu();
    showMenuStatus(`Imported: ${added} new, ${updated} updated`);
  } catch {
    showMenuStatus('Invalid backup JSON file');
  }
});

// --- NAVIGATION & INTERACTION BINDINGS ---

btnGoRevise.addEventListener('click', startRevisionSession);
btnGoDictionary.addEventListener('click', openDictionaryView);
btnGoGrammar.addEventListener('click', openGrammarView);

btnGoAddOne.addEventListener('click', () => {
  addOneStatus.textContent = '';
  showView('addOne');
  setTimeout(() => inputGerman.focus(), 50);
});

btnGoBatch.addEventListener('click', () => {
  batchStatus.textContent = '';
  showView('batch');
});

btnFinishSession.addEventListener('click', async () => {
  await refreshMenu();
  showView('menu');
});

document.querySelectorAll('[data-go="menu"]').forEach((btn) => {
  btn.addEventListener('click', async () => {
    closeEditOverlay();
    closeDictEditOverlay();
    await refreshMenu();
    showView('menu');
  });
});

document.addEventListener('keydown', (e) => {
  if (!views.grammar.classList.contains('is-active')) return;
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    goToGrammarPage(currentGrammarPage - 1, true);
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    goToGrammarPage(currentGrammarPage + 1, true);
  }
});

flashcardEl.addEventListener('click', flipCurrentCard);
flashcardEl.addEventListener('keydown', (e) => {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    flipCurrentCard();
  }
});

ratingBarEl.querySelectorAll('.rate-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const rating = Number(btn.dataset.rating);
    handleRateCard(rating);
  });
});

// --- INITIALIZATION & SERVICE WORKER ---

async function init() {
  initGrammarCheatSheet();
  await requestPersistentStorage();
  await refreshMenu();

  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('./sw.js');
    } catch {
      // Service worker registration may be skipped on non-HTTPS local file opens
    }
  }
}

init();
