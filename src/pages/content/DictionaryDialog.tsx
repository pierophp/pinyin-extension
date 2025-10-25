import React, { useEffect, useRef, useState } from "react";
import separatePinyinInSyllables from "./helpers/separate-pinyin-in-syllables";
import getToneFromPinyin from "./helpers/getToneFromPinyin";
import getColorForTone from "./helpers/getColorForTone";

/**
 * Component to render Chinese characters with tone-based colors
 */
const ColoredIdeogram: React.FC<{
  text: string;
  pinyin: string;
}> = ({ text, pinyin }) => {
  const separatedPinyin = separatePinyinInSyllables(pinyin);
  const characters = Array.from(text);

  // If no pinyin or mismatch, return plain text
  if (separatedPinyin.length === 0 || characters.length === 0) {
    return <span>{text}</span>;
  }

  // Create an array of tones for each character
  const tones: number[] = [];
  let pinyinIndex = 0;

  for (let i = 0; i < characters.length; i++) {
    if (pinyinIndex < separatedPinyin.length) {
      tones.push(getToneFromPinyin(separatedPinyin[pinyinIndex]));
      pinyinIndex++;
    } else {
      tones.push(0); // No pinyin for this character
    }
  }

  // Group consecutive characters with the same color
  const groups: { chars: string[]; tone: number }[] = [];
  let currentGroup: { chars: string[]; tone: number } | null = null;

  for (let i = 0; i < characters.length; i++) {
    const tone = tones[i];
    const char = characters[i];

    if (!currentGroup || currentGroup.tone !== tone) {
      if (currentGroup) {
        groups.push(currentGroup);
      }
      currentGroup = { chars: [char], tone };
    } else {
      currentGroup.chars.push(char);
    }
  }

  if (currentGroup) {
    groups.push(currentGroup);
  }

  // Render spans with colors
  return (
    <>
      {groups.map((group, index) => {
        const text = group.chars.join("");
        const color = getColorForTone(group.tone);

        if (color) {
          return (
            <span key={index} style={{ color }}>
              {text}
            </span>
          );
        }
        return <span key={index}>{text}</span>;
      })}
    </>
  );
};

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

interface DictionaryDialogProps {
  data: DictionaryData | null;
  isLoading: boolean;
  error?: string;
  onClose: () => void;
}

const FrequencyBadge: React.FC<{ frequency: string }> = ({ frequency }) => {
  const colors = {
    alta: "bg-green-100 text-green-800",
    média: "bg-yellow-100 text-yellow-800",
    baixa: "bg-red-100 text-red-800",
  };
  const color =
    colors[frequency.toLowerCase() as keyof typeof colors] ||
    "bg-gray-100 text-gray-800";

  return (
    <span
      className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase ${color}`}
    >
      {frequency}
    </span>
  );
};

const RelatedWord: React.FC<{ word: DictionaryWord }> = ({ word }) => (
  <div className="p-2.5 bg-yellow-50 rounded-md border border-yellow-200">
    <div>
      <span className="text-base font-semibold text-red-700 mr-2">
        {word.simplified}
      </span>
      <span className="text-sm text-emerald-600 italic">{word.pinyin}</span>
    </div>
    {word.usage && (
      <div className="text-sm text-gray-600 mt-1.5 leading-relaxed">
        {word.usage}
      </div>
    )}
  </div>
);

const Expression: React.FC<{ expression: Example }> = ({ expression }) => (
  <div className="p-3 bg-purple-50 rounded-lg mb-2.5 border border-purple-200">
    <div className="text-base text-gray-900 font-medium mb-1">
      {expression.simplified}
    </div>
    <div className="text-sm text-purple-600 mb-1.5 italic">
      {expression.pinyin}
    </div>
    <div className="text-sm text-gray-600 leading-relaxed">
      {expression.translation}
    </div>
  </div>
);

const MeaningSection: React.FC<{ meaning: Meaning; index: number }> = ({
  meaning,
  index,
}) => {
  const [isOpen, setIsOpen] = useState(index === 0);

  return (
    <div className="border border-gray-200 rounded-lg bg-white mb-3 overflow-hidden">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-gray-900 capitalize">
            {meaning.class}
          </span>
          <FrequencyBadge frequency={meaning.frequency} />
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="px-4 pb-4 border-t border-gray-100">
          {/* Definition */}
          <div className="mt-3 mb-4">
            <div className="text-sm font-semibold text-gray-700 mb-2">
              📖 Definição:
            </div>
            <div className="text-base text-gray-900 leading-relaxed">
              {meaning.definition}
            </div>
          </div>

          {/* Usage */}
          {meaning.usage && (
            <div className="mb-4">
              <div className="text-sm font-semibold text-gray-700 mb-2">
                💡 Uso:
              </div>
              <div className="text-sm text-gray-700 leading-relaxed">
                {meaning.usage}
              </div>
            </div>
          )}

          {/* Notes */}
          {meaning.notes && (
            <div className="mb-4">
              <div className="text-sm font-semibold text-gray-700 mb-2">
                📝 Notas:
              </div>
              <div className="text-sm text-gray-700 leading-relaxed">
                {meaning.notes}
              </div>
            </div>
          )}

          {/* Examples */}
          {meaning.examples && meaning.examples.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-semibold text-gray-700 mb-2">
                Exemplos:
              </div>
              {meaning.examples.map((example, idx) => (
                <div key={idx} className="mb-2 last:mb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-emerald-600 text-base font-medium">
                      {example.simplified.split("").map((char, i) => {
                        // Color matching characters from the example
                        const colors = [
                          "text-blue-600",
                          "text-purple-600",
                          "text-emerald-600",
                          "text-red-600",
                          "",
                        ];
                        return (
                          <span key={i} className={colors[i % colors.length]}>
                            {char}
                          </span>
                        );
                      })}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="text-sm text-emerald-600 italic mb-1">
                    {example.pinyin}
                  </div>
                  <div className="text-sm text-gray-600">
                    {example.translation}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Synonyms */}
          {meaning.synonyms && meaning.synonyms.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-semibold text-gray-700 mb-2">
                Sinônimos:
              </div>
              <div className="flex flex-col gap-2">
                {meaning.synonyms.map((synonym, idx) => (
                  <RelatedWord key={idx} word={synonym} />
                ))}
              </div>
            </div>
          )}

          {/* Antonyms */}
          {meaning.antonyms && meaning.antonyms.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-semibold text-gray-700 mb-2">
                Antônimos:
              </div>
              <div className="flex flex-col gap-2">
                {meaning.antonyms.map((antonym, idx) => (
                  <RelatedWord key={idx} word={antonym} />
                ))}
              </div>
            </div>
          )}

          {/* Classifiers */}
          {meaning.classifiers && meaning.classifiers.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-semibold text-gray-700 mb-2">
                Classificadores:
              </div>
              <div className="flex flex-col gap-2">
                {meaning.classifiers.map((classifier, idx) => (
                  <RelatedWord key={idx} word={classifier} />
                ))}
              </div>
            </div>
          )}

          {/* Common expressions */}
          {meaning.common_expressions &&
            meaning.common_expressions.length > 0 && (
              <div className="mb-4">
                <div className="text-sm font-semibold text-gray-700 mb-2">
                  Expressões Comuns:
                </div>
                {meaning.common_expressions.map((expression, idx) => (
                  <Expression key={idx} expression={expression} />
                ))}
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export const DictionaryDialog: React.FC<DictionaryDialogProps> = ({
  data,
  isLoading,
  error,
  onClose,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeTab, setActiveTab] = useState<"geral" | "ia">("ia");

  useEffect(() => {
    if (dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
  }, []);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = e.currentTarget;
    const rect = dialog.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      dialog.close();
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 w-[90%] max-w-[700px] max-h-[85vh] m-auto p-0 bg-transparent rounded-2xl shadow-2xl border-0 backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", "Microsoft YaHei", sans-serif',
      }}
    >
      <div className="bg-white rounded-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-gray-600">
            <div className="w-10 h-10 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4" />
            <div className="text-base">Carregando dicionário...</div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <>
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white">
              <div className="text-3xl font-semibold text-gray-900">Erro</div>
              <button
                onClick={() => {
                  dialogRef.current?.close();
                  onClose();
                }}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg text-2xl text-gray-600 hover:text-gray-800 flex items-center justify-center transition-colors"
              >
                ×
              </button>
            </div>
            <div className="px-6 py-5">
              <div className="p-5 bg-red-50 border border-red-200 rounded-lg text-red-800 text-center">
                {error}
              </div>
            </div>
          </>
        )}

        {/* Content state */}
        {data && !isLoading && !error && (
          <>
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <span className="text-emerald-600 text-2xl font-semibold">
                  <ColoredIdeogram
                    text={data.simplified}
                    pinyin={data.meanings[0]?.pronunciation || ""}
                  />
                </span>
                {data.traditional !== data.simplified && (
                  <span className="text-gray-400 text-xl">
                    <ColoredIdeogram
                      text={data.traditional}
                      pinyin={data.meanings[0]?.pronunciation || ""}
                    />
                  </span>
                )}
                <span className="text-gray-600 text-lg">
                  {data.meanings[0]?.pronunciation}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      data.meanings[0]?.pronunciation || ""
                    );
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  title="Copiar pinyin"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
              <button
                onClick={() => {
                  dialogRef.current?.close();
                  onClose();
                }}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg text-2xl text-gray-600 hover:text-gray-800 flex items-center justify-center transition-colors"
              >
                ×
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("geral")}
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                  activeTab === "geral"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                Geral
              </button>
              <button
                onClick={() => setActiveTab("ia")}
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                  activeTab === "ia"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                IA
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto px-6 py-6 flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
              {activeTab === "geral" && (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-lg font-semibold mb-2">
                    Funcionalidade IA em desenvolvimento
                  </div>
                  <div className="text-sm">
                    Em breve você poderá conversar com a IA sobre esta palavra
                  </div>
                </div>
              )}
              {activeTab === "ia" && (
                <>
                  {data.meanings.length > 1 && (
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-blue-900 font-semibold">
                        Total de significados: {data.meanings.length}
                      </div>
                    </div>
                  )}

                  {/* Meanings list */}
                  {data.meanings.map((meaning, index) => (
                    <MeaningSection
                      key={index}
                      meaning={meaning}
                      index={index}
                    />
                  ))}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </dialog>
  );
};
