/**
 * Get tone number from a pinyin syllable
 * Returns 1-4 for tones, 0 for neutral/no tone mark
 */
export default function getToneFromPinyin(pinyin: string): number {
  if (!pinyin) return 0;

  const tone1 = /[āēīōūǖ]/;
  const tone2 = /[áéíóúǘ]/;
  const tone3 = /[ǎěǐǒǔǚ]/;
  const tone4 = /[àèìòùǜ]/;

  if (tone1.test(pinyin)) return 1;
  if (tone2.test(pinyin)) return 2;
  if (tone3.test(pinyin)) return 3;
  if (tone4.test(pinyin)) return 4;
  return 0; // Neutral tone
}
