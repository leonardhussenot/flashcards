// IndexedDB persistence layer supporting isolated 'de' and 'fr' decks

const DB_NAME = 'german_flashcards_db';
const DB_VERSION = 2;
const STORE_DE = 'cards';    // Preserves existing German deck with zero migration risk
const STORE_FR = 'cards_fr'; // Separate deck for French mode

let dbPromise = null;

function getStoreName(lang = 'de') {
  return lang === 'fr' ? STORE_FR : STORE_DE;
}

export function normalizeTargetKey(text) {
  return String(text || '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

export function cleanText(text) {
  return String(text || '')
    .trim()
    .replace(/\s+/g, ' ');
}

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `card_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function requestPersistentStorage() {
  try {
    if (navigator.storage && navigator.storage.persist) {
      await navigator.storage.persist();
    }
  } catch {
    // Ignore if unsupported in browser context
  }
}

function openDB() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_DE)) {
        const storeDe = db.createObjectStore(STORE_DE, { keyPath: 'id' });
        storeDe.createIndex('germanKey', 'germanKey', { unique: true });
      }
      if (!db.objectStoreNames.contains(STORE_FR)) {
        const storeFr = db.createObjectStore(STORE_FR, { keyPath: 'id' });
        storeFr.createIndex('germanKey', 'germanKey', { unique: true });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  return dbPromise;
}

export async function getAllCards(lang = 'de') {
  const storeName = getStoreName(lang);
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Adds new cards or updates translation if target text already exists
 * while preserving FSRS learning progress.
 */
export async function upsertCardPairs(pairs, lang = 'de') {
  const storeName = getStoreName(lang);
  const existing = await getAllCards(lang);
  const byKey = new Map(existing.map((c) => [c.germanKey, c]));

  let added = 0;
  let updated = 0;
  const now = Date.now();
  const toPut = [];

  for (const raw of pairs) {
    const german = cleanText(raw.german);
    const translation = cleanText(raw.translation);
    if (!german || !translation) continue;

    const key = normalizeTargetKey(german);
    const match = byKey.get(key);

    if (match) {
      const updatedCard = {
        ...match,
        german,
        germanKey: key,
        translation,
        updatedAt: now
      };
      byKey.set(key, updatedCard);
      toPut.push(updatedCard);
      updated += 1;
    } else {
      const newCard = {
        id: generateId(),
        german,
        germanKey: key,
        translation,
        stability: 0,
        difficulty: 0,
        reps: 0,
        lapses: 0,
        lastReviewAt: null,
        dueAt: null,
        createdAt: now,
        updatedAt: now
      };
      byKey.set(key, newCard);
      toPut.push(newCard);
      added += 1;
    }
  }

  if (toPut.length > 0) {
    const db = await openDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      for (const card of toPut) {
        store.put(card);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  return { added, updated };
}

/**
 * Saves an updated card (e.g. after FSRS review or inline edit).
 */
export async function saveCard(card, lang = 'de') {
  const storeName = getStoreName(lang);
  const german = cleanText(card.german);
  const translation = cleanText(card.translation);
  const key = normalizeTargetKey(german);

  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const index = store.index('germanKey');
    const lookup = index.get(key);

    lookup.onsuccess = () => {
      const colliding = lookup.result;
      if (colliding && colliding.id !== card.id) {
        store.delete(colliding.id);
      }
      const cleanCard = {
        ...card,
        german,
        germanKey: key,
        translation,
        updatedAt: Date.now()
      };
      store.put(cleanCard);
      tx.oncomplete = () => resolve(cleanCard);
    };

    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteCard(id, lang = 'de') {
  const storeName = getStoreName(lang);
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Imports cards from a JSON backup file into the active language deck,
 * preserving FSRS learning history.
 */
export async function importBackupCards(rawCards, lang = 'de') {
  if (!Array.isArray(rawCards)) {
    throw new Error('Invalid backup format: expected a list of cards.');
  }

  const storeName = getStoreName(lang);
  const existing = await getAllCards(lang);
  const byKey = new Map(existing.map((c) => [c.germanKey, c]));
  const now = Date.now();
  const toPut = [];
  let added = 0;
  let updated = 0;

  for (const item of rawCards) {
    if (!item || typeof item !== 'object') continue;
    const german = cleanText(item.german ?? item.target);
    const translation = cleanText(item.translation);
    if (!german || !translation) continue;

    const key = normalizeTargetKey(german);
    const current = byKey.get(key);

    const incomingCard = {
      id: current
        ? current.id
        : typeof item.id === 'string' && item.id
          ? item.id
          : generateId(),
      german,
      germanKey: key,
      translation,
      stability: Number(item.stability) || 0,
      difficulty: Number(item.difficulty) || 0,
      reps: Number(item.reps) || 0,
      lapses: Number(item.lapses) || 0,
      lastReviewAt: item.lastReviewAt ? Number(item.lastReviewAt) : null,
      dueAt: item.dueAt ? Number(item.dueAt) : null,
      createdAt: Number(item.createdAt) || now,
      updatedAt: now
    };

    if (current) {
      const keepLocalProgress =
        (current.lastReviewAt || 0) > (incomingCard.lastReviewAt || 0) ||
        ((current.reps || 0) > (incomingCard.reps || 0) &&
          !incomingCard.lastReviewAt);

      const merged = keepLocalProgress
        ? {
            ...current,
            german,
            germanKey: key,
            translation,
            updatedAt: now
          }
        : incomingCard;

      byKey.set(key, merged);
      toPut.push(merged);
      updated += 1;
    } else {
      byKey.set(key, incomingCard);
      toPut.push(incomingCard);
      added += 1;
    }
  }

  if (toPut.length > 0) {
    const db = await openDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      for (const c of toPut) {
        store.put(c);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  return { added, updated };
}
