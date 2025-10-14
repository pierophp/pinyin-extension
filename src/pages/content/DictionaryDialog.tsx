import React from "react";

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

const ExampleItem: React.FC<{ example: Example }> = ({ example }) => (
  <div className="p-3 bg-gray-50 rounded-lg mb-2.5 border border-gray-200">
    <div className="text-base text-gray-900 mb-1 font-medium">
      {example.simplified}
      {example.traditional !== example.simplified && (
        <span className="text-gray-400 text-sm ml-2">
          ({example.traditional})
        </span>
      )}
    </div>
    <div className="text-sm text-emerald-600 mb-1.5 italic">
      {example.pinyin}
    </div>
    <div className="text-sm text-gray-600 leading-relaxed">
      {example.translation}
    </div>
  </div>
);

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
}) => (
  <>
    {index > 0 && (
      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-6" />
    )}
    <div className="mb-6">
      {/* Meaning header */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <span className="px-3 py-1 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-md text-sm font-semibold capitalize">
          {meaning.class}
        </span>
        <span className="text-emerald-600 text-base font-medium">
          {meaning.pronunciation}
        </span>
        <FrequencyBadge frequency={meaning.frequency} />
      </div>

      {/* Definition */}
      <div className="text-lg text-gray-900 font-medium mb-3 leading-relaxed">
        {meaning.definition}
      </div>

      {/* Usage */}
      {meaning.usage && (
        <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded text-blue-900 text-sm leading-relaxed mb-4">
          <strong>Uso:</strong> {meaning.usage}
        </div>
      )}

      {/* Examples */}
      {meaning.examples && meaning.examples.length > 0 && (
        <div className="mt-5 pt-4">
          <div className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3">
            Exemplos:
          </div>
          {meaning.examples.map((example, idx) => (
            <ExampleItem key={idx} example={example} />
          ))}
        </div>
      )}

      {/* Synonyms */}
      {meaning.synonyms && meaning.synonyms.length > 0 && (
        <div className="mt-5 pt-4">
          <div className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3">
            Sinônimos:
          </div>
          <div className="flex flex-col gap-2.5">
            {meaning.synonyms.map((synonym, idx) => (
              <RelatedWord key={idx} word={synonym} />
            ))}
          </div>
        </div>
      )}

      {/* Antonyms */}
      {meaning.antonyms && meaning.antonyms.length > 0 && (
        <div className="mt-5 pt-4">
          <div className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3">
            Antônimos:
          </div>
          <div className="flex flex-col gap-2.5">
            {meaning.antonyms.map((antonym, idx) => (
              <RelatedWord key={idx} word={antonym} />
            ))}
          </div>
        </div>
      )}

      {/* Classifiers */}
      {meaning.classifiers && meaning.classifiers.length > 0 && (
        <div className="mt-5 pt-4">
          <div className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3">
            Classificadores:
          </div>
          <div className="flex flex-col gap-2.5">
            {meaning.classifiers.map((classifier, idx) => (
              <RelatedWord key={idx} word={classifier} />
            ))}
          </div>
        </div>
      )}

      {/* Common expressions */}
      {meaning.common_expressions && meaning.common_expressions.length > 0 && (
        <div className="mt-5 pt-4">
          <div className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3">
            Expressões Comuns:
          </div>
          {meaning.common_expressions.map((expression, idx) => (
            <Expression key={idx} expression={expression} />
          ))}
        </div>
      )}

      {/* Notes */}
      {meaning.notes && (
        <div className="p-3.5 bg-amber-50 border-l-4 border-amber-500 rounded text-amber-900 text-sm leading-relaxed mt-4">
          <strong>📝 Notas:</strong> {meaning.notes}
        </div>
      )}
    </div>
  </>
);

export const DictionaryDialog: React.FC<DictionaryDialogProps> = ({
  data,
  isLoading,
  error,
  onClose,
}) => {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = e.currentTarget;
    const rect = dialog.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      onClose();
    }
  };

  return (
    <dialog
      open
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
                onClick={onClose}
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
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white">
              <div className="flex items-center gap-3 text-3xl font-semibold">
                <span className="text-red-600">{data.simplified}</span>
                {data.traditional !== data.simplified && (
                  <span className="text-gray-400 text-xl">
                    {data.traditional}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg text-2xl text-gray-600 hover:text-gray-800 flex items-center justify-center transition-colors"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto px-6 py-6 flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
              {data.meanings.map((meaning, index) => (
                <MeaningSection key={index} meaning={meaning} index={index} />
              ))}
            </div>
          </>
        )}
      </div>
    </dialog>
  );
};
