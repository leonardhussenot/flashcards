// Dictionary search & headword alphabetical sorting helpers for DE and FR

const LEADING_PREFIX_DE_RE =
  /^(?:(?:\(es\)\s+)|(?:der|die|das|ein|eine|einen|einem|eines|sich|jemanden|jemandem|jemandes|etwas)\s+)+/i;

const LEADING_PREFIX_FR_RE =
  /^(?:(?:de\s+la\s+|de\s+l['’]\s*)|(?:le|la|les|un|une|des|du|se|quelqu['’]un|quelque\s+chose)\s+|(?:l|s|d)['’]\s*)+/i;

/**
 * Normalizes text for accent-, ligature-, and German ß/ss-insensitive matching.
 * e.g. "Überraschung" -> "uberraschung", "stoßen" -> "stossen", "le cœur" -> "le coeur"
 */
export function foldSearchText(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’']/g, "'")
    .trim();
}

/**
 * Extracts the core headword for natural dictionary sorting:
 * - DE: "der Hund" -> "hund", "sich umdrehen" -> "umdrehen"
 * - FR: "la maison" -> "maison", "l'arbre" -> "arbre", "se souvenir de" -> "souvenir de"
 */
export function getSortHeadword(text, lang = 'de') {
  const raw = String(text || '')
    .trim()
    .replace(/^["„«¡¿]+/, '');
  const prefixRe = lang === 'fr' ? LEADING_PREFIX_FR_RE : LEADING_PREFIX_DE_RE;
  const stripped = raw
    .replace(prefixRe, '')
    .replace(/^[()]+/, '')
    .trim();
  return foldSearchText(stripped || raw);
}

/**
 * Returns cards sorted alphabetically by headword, or ranked by relevance
 * when a search query is active (matching both target expression and translation).
 */
export function filterAndSortCards(cards, query = '', lang = 'de') {
  const locale = lang === 'fr' ? 'fr' : 'de';
  const qFolded = foldSearchText(query);
  const qRaw = String(query || '').trim().toLowerCase();

  if (!qFolded) {
    return [...cards].sort((a, b) => {
      const ha = getSortHeadword(a.german, lang);
      const hb = getSortHeadword(b.german, lang);
      if (ha !== hb) return ha.localeCompare(hb, locale);
      return a.german.localeCompare(b.german, locale);
    });
  }

  const matches = [];
  for (const card of cards) {
    const deFolded = foldSearchText(card.german);
    const trFolded = foldSearchText(card.translation);
    const headFolded = getSortHeadword(card.german, lang);
    const deRaw = card.german.toLowerCase();
    const trRaw = card.translation.toLowerCase();

    const inDe = deFolded.includes(qFolded) || deRaw.includes(qRaw);
    const inTr = trFolded.includes(qFolded) || trRaw.includes(qRaw);

    if (!inDe && !inTr) continue;

    let rank = 4;
    if (
      headFolded === qFolded ||
      deFolded === qFolded ||
      trFolded === qFolded
    ) {
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
      return a.headFolded.localeCompare(b.headFolded, locale);
    }
    return a.card.german.localeCompare(b.card.german, locale);
  });

  return matches.map((m) => m.card);
}
