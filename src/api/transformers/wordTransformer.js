const normalizeMeanings = (meanings = []) => meanings.map((meaning) => ({
  id: meaning.id,
  part_of_speech: meaning.part_of_speech || meaning.partOfSpeech || '',
  definition: meaning.definition || meaning?.definitions?.[0]?.definition || '',
  example: meaning.example || meaning?.definitions?.[0]?.example || null,
}));

const getPrimaryAudio = (word = {}) => {
  if (word.audio_url) return word.audio_url;
  if (Array.isArray(word.pronunciations) && word.pronunciations.length > 0) {
    return word.pronunciations[0]?.audio_url || null;
  }
  return null;
};

export const transformWord = (word) => {
  if (!word) return null;

  return {
    ...word,
    text: word.text || word.word || '',
    phonetic_text: word.phonetic_text || word.phonetic || null,
    audio_url: getPrimaryAudio(word),
    meanings: normalizeMeanings(word.meanings || []),
  };
};

export const transformWordList = (words = []) => words.map(transformWord);

export const transformWOTD = (payload) => {
  if (!payload) return null;

  if (payload.word) {
    return {
      ...payload,
      word: transformWord(payload.word),
    };
  }

  return transformWord(payload);
};

export const transformDailyPractice = (payload) => {
  if (!payload) return payload;

  if (Array.isArray(payload)) return transformWordList(payload);

  return {
    ...payload,
    words: transformWordList(payload.words || []),
  };
};
