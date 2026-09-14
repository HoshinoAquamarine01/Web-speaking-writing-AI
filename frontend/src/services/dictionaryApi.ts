import { generateApproximateIPA } from '../utils/ipaGenerator';

export interface DictionaryDefinition {
  definition: string;
  vietnameseDefinition?: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}

export interface DictionaryMeaning {
  partOfSpeech: string;
  definitions: DictionaryDefinition[];
}

export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  audioUrl?: string;
  vietnameseMeaning?: string;
  meanings: DictionaryMeaning[];
  origin?: string;
}

// In-Memory Fast Cache for instantaneous repeat lookups
const dictionaryCache = new Map<string, DictionaryEntry>();

// Dictionary for common IELTS & TOEIC words with full Vietnamese meanings & accurate IPA
const COMMON_VIETNAMESE_DICT: Record<string, { ipa: string; vi: string; pos: string; example: string }> = {
  modern: { ipa: '/ˈmɒd.ən/', vi: 'Hiện đại, tân tiến', pos: 'adjective', example: 'Da Nang has modern transport infrastructure.' },
  hello: { ipa: '/həˈləʊ/', vi: 'Xin chào, lời chào', pos: 'exclamation', example: 'Hello there! Welcome to speaking practice.' },
  resilience: { ipa: '/rɪˈzɪl.jəns/', vi: 'Khả năng phục hồi, sự kiên cường', pos: 'noun', example: 'Developing psychological resilience is crucial for exam success.' },
  infrastructure: { ipa: '/ˈɪn.frəˌstrʌk.tʃər/', vi: 'Cơ sở hạ tầng', pos: 'noun', example: 'The city invested heavily in modern transport infrastructure.' },
  approximately: { ipa: '/əˈprɒk.sɪ.mət.li/', vi: 'Xấp xỉ, khoảng', pos: 'adverb', example: 'Boarding will begin in approximately twenty minutes.' },
  collaborative: { ipa: '/kəˈlæb.ər.ə.tɪv/', vi: 'Mang tính hợp tác, làm việc nhóm', pos: 'adjective', example: 'Teamwork creates a collaborative atmosphere.' },
  pivotal: { ipa: '/ˈpɪv.ə.təl/', vi: 'Then chốt, quan trọng nhất', pos: 'adjective', example: 'He played a pivotal role in shaping my career path.' },
  indispensable: { ipa: '/ˌɪn.dɪˈspen.sə.bəl/', vi: 'Không thể thiếu, vô giá', pos: 'adjective', example: 'Smartphones have become indispensable in daily life.' },
  sustainability: { ipa: '/səˌsteɪ.nəˈbɪl.ə.ti/', vi: 'Sự bền vững, bảo vệ môi trường', pos: 'noun', example: 'Green technology promotes environmental sustainability.' },
  extraordinarily: { ipa: '/ɪkˈstrɔː.dɪn.ər.əl.i/', vi: 'Một cách phi thường, đặc biệt', pos: 'adverb', example: 'She spoke extraordinarily well during the interview.' },
  pedagogy: { ipa: '/ˈped.ə.ɡɒdʒ.i/', vi: 'Phương pháp giảng dạy', pos: 'noun', example: 'Technology has transformed modern educational pedagogy.' },
  perseverance: { ipa: '/ˌpɜː.sɪˈvɪə.rəns/', vi: 'Sự kiên trì, bền bỉ', pos: 'noun', example: 'Success requires consistent practice and perseverance.' },
  vibrant: { ipa: '/ˈvaɪ.brənt/', vi: 'Sôi động, đầy sức sống', pos: 'adjective', example: 'Da Nang is a vibrant coastal city.' },
  ambient: { ipa: '/ˈæm.bi.ənt/', vi: 'Xung quanh, bao quanh', pos: 'adjective', example: 'Headphones block out ambient background noise.' },
  convenience: { ipa: '/kənˈviː.ni.əns/', vi: 'Sự tiện lợi, thuận tiện', pos: 'noun', example: 'Online shopping offers great convenience.' },
  punctual: { ipa: '/ˈpʌŋk.tʃu.əl/', vi: 'Đúng giờ, chuẩn xác thời gian', pos: 'adjective', example: 'The metro system is punctual and reliable.' }
};

export async function fetchWordDefinition(word: string): Promise<DictionaryEntry> {
  const cleanWord = word.trim().toLowerCase();
  if (!cleanWord) return createSmartFallback('vocabulary');

  // 1. Check in-memory cache (0ms)
  if (dictionaryCache.has(cleanWord)) {
    return dictionaryCache.get(cleanWord)!;
  }

  // 2. Check offline dictionary for rich Vietnamese definitions (0ms)
  if (COMMON_VIETNAMESE_DICT[cleanWord]) {
    const item = COMMON_VIETNAMESE_DICT[cleanWord];
    const entry: DictionaryEntry = {
      word: cleanWord,
      phonetic: item.ipa,
      vietnameseMeaning: item.vi,
      meanings: [
        {
          partOfSpeech: item.pos,
          definitions: [
            {
              definition: `[Nghĩa tiếng Việt]: ${item.vi}`,
              example: item.example
            }
          ]
        }
      ]
    };
    dictionaryCache.set(cleanWord, entry);
    return entry;
  }

  // 3. Fetch from API (backend proxy or direct)
  try {
    let res: Response | null = null;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      res = await fetch(`http://localhost:3001/api/dictionary/${encodeURIComponent(cleanWord)}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
    } catch (e) {
      // ignore
    }

    if (!res || !res.ok) {
      try {
        const controller2 = new AbortController();
        const timeoutId2 = setTimeout(() => controller2.abort(), 2000);
        res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanWord)}`, {
          signal: controller2.signal
        });
        clearTimeout(timeoutId2);
      } catch (e) {
        // ignore
      }
    }

    if (res && res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const entry = data[0];

        let audioUrl = '';
        if (Array.isArray(entry.phonetics)) {
          for (const p of entry.phonetics) {
            if (p.audio && p.audio.trim().length > 0) {
              audioUrl = p.audio.startsWith('//') ? `https:${p.audio}` : p.audio;
              break;
            }
          }
        }

        let phoneticText = entry.phonetic || '';
        if (!phoneticText && Array.isArray(entry.phonetics)) {
          const pWithText = entry.phonetics.find((p: any) => p.text);
          if (pWithText) phoneticText = pWithText.text;
        }

        const meanings: DictionaryMeaning[] = (entry.meanings || []).map((m: any) => ({
          partOfSpeech: m.partOfSpeech || 'general',
          definitions: (m.definitions || []).slice(0, 3).map((d: any) => ({
            definition: d.definition || '',
            example: d.example || '',
            synonyms: (d.synonyms || []).slice(0, 4),
            antonyms: (d.antonyms || []).slice(0, 4)
          }))
        }));

        const resultEntry: DictionaryEntry = {
          word: entry.word || cleanWord,
          phonetic: phoneticText || generateApproximateIPA(cleanWord),
          audioUrl,
          vietnameseMeaning: getVietnameseQuickMeaning(cleanWord, meanings[0]?.definitions[0]?.definition),
          meanings,
          origin: entry.origin
        };

        dictionaryCache.set(cleanWord, resultEntry);
        return resultEntry;
      }
    }
  } catch (err) {
    console.error('Error fetching Dictionary API:', err);
  }

  // 4. Fallback Smart Entry with Online Translation & Datamuse Definitions
  const fallback = await createSmartFallback(cleanWord);
  dictionaryCache.set(cleanWord, fallback);
  return fallback;
}

function getVietnameseQuickMeaning(word: string, englishDef?: string): string {
  if (COMMON_VIETNAMESE_DICT[word.toLowerCase()]) {
    return COMMON_VIETNAMESE_DICT[word.toLowerCase()].vi;
  }
  if (!englishDef) return `Từ vựng tiếng Anh "${word}"`;
  return `${englishDef}`;
}

async function createSmartFallback(word: string): Promise<DictionaryEntry> {
  const cleanWord = word.trim().toLowerCase();
  const ipa = generateApproximateIPA(cleanWord);
  const dictItem = COMMON_VIETNAMESE_DICT[cleanWord];

  if (dictItem) {
    return {
      word: cleanWord,
      phonetic: dictItem.ipa,
      vietnameseMeaning: dictItem.vi,
      meanings: [
        {
          partOfSpeech: dictItem.pos,
          definitions: [
            {
              definition: `[Nghĩa tiếng Việt]: ${dictItem.vi}`,
              example: dictItem.example
            }
          ]
        }
      ]
    };
  }

  // Try online MyMemory & Datamuse APIs
  let viMeaning = '';
  let englishDef = '';
  let partOfSpeech = 'vocabulary';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    // MyMemory Translation API
    const resVi = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanWord)}&langpair=en|vi`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (resVi.ok) {
      const dataVi = await resVi.json();
      if (dataVi?.responseData?.translatedText) {
        const trans = dataVi.responseData.translatedText.trim();
        if (trans && !trans.toLowerCase().includes('is an invalid') && trans.toLowerCase() !== cleanWord) {
          viMeaning = trans.charAt(0).toUpperCase() + trans.slice(1);
        }
      }
    }
  } catch (e) {
    // ignore
  }

  try {
    const controller2 = new AbortController();
    const timeoutId2 = setTimeout(() => controller2.abort(), 2000);

    // Datamuse Definition API
    const resDm = await fetch(`https://api.datamuse.com/words?sp=${encodeURIComponent(cleanWord)}&md=d,p&max=1`, {
      signal: controller2.signal
    });
    clearTimeout(timeoutId2);

    if (resDm.ok) {
      const dataDm = await resDm.json();
      if (Array.isArray(dataDm) && dataDm.length > 0 && Array.isArray(dataDm[0].defs)) {
        const rawDef = dataDm[0].defs[0] || '';
        const parts = rawDef.split('\t');
        if (parts.length > 1) {
          const rawPos = parts[0];
          partOfSpeech = rawPos === 'n' ? 'noun' : rawPos === 'v' ? 'verb' : rawPos === 'adj' ? 'adjective' : rawPos === 'adv' ? 'adverb' : rawPos;
          englishDef = parts[1];
        } else {
          englishDef = rawDef;
        }
      }
    }
  } catch (e) {
    // ignore
  }

  const finalViMeaning = viMeaning || `Từ vựng tiếng Anh "${cleanWord}"`;
  const finalDefinition = englishDef
    ? (viMeaning ? `[Nghĩa Tiếng Việt]: ${viMeaning}\n[English Definition]: ${englishDef}` : englishDef)
    : `[Nghĩa Tiếng Việt]: ${finalViMeaning}`;

  return {
    word: cleanWord,
    phonetic: ipa,
    vietnameseMeaning: finalViMeaning,
    meanings: [
      {
        partOfSpeech,
        definitions: [
          {
            definition: finalDefinition,
            example: `I am using the word "${cleanWord}" to improve my English speaking and writing accuracy.`
          }
        ]
      }
    ]
  };
}

