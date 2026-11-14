// Dictionary search & German headword alphabetical sorting helpers

const LEADING_PREFIX_RE =
  /^(?:(?:\(es\)\s+)|(?:der|die|das|ein|eine|einen|einem|eines|sich|jemanden|jemandem|jemandes|etwas)\s+)+/i;

/**
 * Normalizes text for accent-insensitive and German ß/ss-insensitive matching.
 * e.g. "Überraschung" -> "uberraschung", "stoßen" -> "stossen", "être" -> "etre"
 */
export function foldSearchText(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’']/g, "'")
    .trim();
}

/**
 * Extracts the core German headword for natural dictionary sorting
 * so "der Hund" sorts under H and "sich umdrehen" sorts under U.
 */
export function getSortHeadword(german) {
  const raw = String(german || '')
    .trim()
    .replace(/^["„«¡¿]+/, '');
  const stripped = raw.replace(LEADING_PREFIX_RE, '').replace(/^[()]+/, '').trim();
  return foldSearchText(stripped || raw);
}

/**
 * Returns cards sorted alphabetically by German headword, or ranked by relevance
 * when a search query is active (matching both German and Translation).
 */
export function filterAndSortCards(cards, query = '') {
  const qFolded = foldSearchText(query);
  const qRaw = String(query || '').trim().toLowerCase();

  if (!qFolded) {
    return [...cards].sort((a, b) => {
      const ha = getSortHeadword(a.german);
      const hb = getSortHeadword(b.german);
      if (ha !== hb) return ha.localeCompare(hb, 'de');
      return a.german.localeCompare(b.german, 'de');
    });
  }

  const matches = [];
  for (const card of cards) {
    const deFolded = foldSearchText(card.german);
    const trFolded = foldSearchText(card.translation);
    const headFolded = getSortHeadword(card.german);
    const deRaw = card.german.toLowerCase();
    const trRaw = card.translation.toLowerCase();

    const inDe = deFolded.includes(qFolded) || deRaw.includes(qRaw);
    const inTr = trFolded.includes(qFolded) || trRaw.includes(qRaw);

    if (!inDe && !inTr) continue;

    // Relevance rank: 0 = exact headword/full, 1 = prefix of headword/German,
    // 2 = prefix of translation, 3 = substring in German, 4 = substring in translation
    let rank = 4;
    if (headFolded === qFolded || deFolded === qFolded || trFolded === qFolded) {
      rank = 0;
    } else if (headFolded.startsWith(qFolded) || deFolded.startsWith(qFolded)) {
      rank = 1;
    } else if (trFolded.startsWith(qFolded)) {
      rank = 2;
    } else if (inDe) {
      rank = 3;
    }

    matches.push({ card, rank, headFolded });
  }

  matches.sort((a, b) => {
    if (a.rank !== b.rank) return a.rank - b.rank;
    if (a.headFolded !== b.headFolded) {
      return a.headFolded.localeCompare(b.headFolded, 'de');
    }
    return a.card.german.localeCompare(b.card.german, 'de');
  });

  return matches.map((m) => m.card);
}
