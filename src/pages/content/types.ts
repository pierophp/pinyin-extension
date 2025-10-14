// Type definitions for dictionary data
interface DictionaryWord {
  simplified: string;
  traditional: string;
  pinyin: string;
  frequency: string;
  usage?: string;
}

interface Example {
  simplified: string;
  traditional: string;
  pinyin: string;
  translation: string;
}

interface Meaning {
  class: string;
  definition: string;
  pronunciation: string;
  usage?: string;
  frequency: string;
  examples?: Example[];
  synonyms?: DictionaryWord[];
  antonyms?: DictionaryWord[];
  classifiers?: DictionaryWord[];
  common_expressions?: Example[];
  notes?: string;
}

interface DictionaryData {
  simplified: string;
  traditional: string;
  meanings: Meaning[];
  executionTime?: number;
}
