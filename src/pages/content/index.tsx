import "./style.css";

// List of Chinese words that should have their pinyin (ruby text) removed
const WORDS_TO_HIDE_PINYIN: string[] = [
  "上帝",
  "最初",
  // Add more words here as needed
];

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

/**
 * Remove pinyin (rt element) from ruby elements where rb matches the word list
 */
function removePinyinForSpecificWords(
  rootElement: Document | Element = document
) {
  // Find all ruby elements
  const rubyElements = rootElement.querySelectorAll("ruby");

  rubyElements.forEach((ruby) => {
    // Get the rb (ruby base) element
    const rbElement = ruby.querySelector("rb");
    if (!rbElement) return;

    // Check if the text content matches any word in our list
    const rbText = rbElement.textContent?.trim() || "";
    if (WORDS_TO_HIDE_PINYIN.includes(rbText)) {
      // Find all rt (ruby text) elements and clear their content
      const rtElements = ruby.querySelectorAll("rt");
      rtElements.forEach((rt) => {
        rt.textContent = "";
      });
    }
  });
}

/**
 * Fetch dictionary data for a Chinese word
 */
async function fetchDictionaryData(
  word: string
): Promise<DictionaryData | null> {
  console.log(`[Pinzi] fetchDictionaryData called for word: "${word}"`);
  try {
    // Mock data for testing - replace with actual API call when ready
    // const API_ENDPOINT = "YOUR_API_ENDPOINT_HERE";
    // const response = await fetch(
    //   `${API_ENDPOINT}?word=${encodeURIComponent(word)}`
    // );
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }
    // const data: DictionaryData = await response.json();
    // return data;

    // Simulate API delay
    console.log("[Pinzi] Simulating API delay (500ms)...");
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock data
    const mockData: DictionaryData = {
      meanings: [
        {
          class: "verbo",
          usage:
            "Usado para expressar um desejo ou uma expectativa sobre algo. Geralmente é seguido por uma oração que descreve o que se espera. Pode ser usado com '能' (néng) para suavizar o desejo, tornando-o mais uma esperança do que uma exigência.",
          antonyms: [
            {
              usage:
                "Significa 'ficar desapontado', 'perder a esperança'. É o oposto direto de ter uma esperança, descrevendo o sentimento após um resultado negativo.",
              pinyin: "shī wàng",
              frequency: "alta",
              simplified: "失望",
              traditional: "失望",
            },
          ],
          examples: [
            {
              pinyin: "wǒ xī wàng míng tiān tiān qì hǎo.",
              simplified: "我 希望 明天 天气 好。",
              traditional: "我 希望 明天 天氣 好。",
              translation: "Espero que amanhã faça bom tempo.",
            },
            {
              pinyin: "tā xī wàng néng zhǎo dào yī gè hǎo gōng zuò.",
              simplified: "他 希望 能 找到 一个 好 工作。",
              traditional: "他 希望 能 找到 一個 好 工作。",
              translation: "Ele espera poder encontrar um bom trabalho.",
            },
          ],
          synonyms: [
            {
              usage:
                "Significa 'ansiar por', 'aguardar com expectativa'. Implica uma espera mais longa e um desejo mais forte e emocional do que '希望'.",
              pinyin: "pàn wàng",
              frequency: "média",
              simplified: "盼望",
              traditional: "盼望",
            },
            {
              usage:
                "Refere-se a 'ter uma expectativa sobre alguém ou algo', muitas vezes implicando que essa expectativa é razoável ou que há uma base para ela. É mais formal e menos emocional que '希望'.",
              pinyin: "qī wàng",
              frequency: "média",
              simplified: "期望",
              traditional: "期望",
            },
          ],
          frequency: "alta",
          definition: "esperar; desejar",
          pronunciation: "xī wàng",
        },
        {
          class: "substantivo",
          notes:
            "A palavra '希望' é fundamental tanto na fala cotidiana quanto na escrita formal. O caractere '希' (xī) por si só significa 'esperar' ou 'raro', enquanto '望' (wàng) significa 'olhar para longe' ou 'esperar'. Juntos, eles criam a imagem de 'olhar para longe com expectativa', que encapsula perfeitamente o conceito de esperança.",
          usage:
            "Refere-se ao conceito ou sentimento de esperança. Pode ser o sujeito ou o objeto de uma frase.",
          antonyms: [
            {
              usage:
                "Significa 'desespero', 'desesperança'. É um estado de completa ausência de esperança, muito mais forte que '失望' (desapontamento).",
              pinyin: "jué wàng",
              frequency: "média",
              simplified: "绝望",
              traditional: "絕望",
            },
          ],
          examples: [
            {
              pinyin: "bù yào fàng qì xī wàng.",
              simplified: "不要 放弃 希望。",
              traditional: "不要 放棄 希望。",
              translation: "Não perca a esperança.",
            },
            {
              pinyin: "tā zuì dà de xī wàng jiù shì jiā rén jiàn kāng.",
              simplified: "他 最大 的 希望 就是 家人 健康。",
              traditional: "他 最大 的 希望 就是 家人 健康。",
              translation:
                "A maior esperança dele é que sua família seja saudável.",
            },
          ],
          frequency: "alta",
          definition: "esperança; desejo",
          classifiers: [
            {
              usage:
                "Classificador geral, usado para um desejo ou esperança específica e contável. Ex: 一个希望 (yī gè xī wàng) - uma esperança.",
              pinyin: "gè",
              frequency: "alta",
              simplified: "个",
              traditional: "個",
            },
            {
              usage:
                "Literalmente 'um fio de', usado para descrever uma pequena quantidade ou um vislumbre de esperança. Ex: 一丝希望 (yī sī xī wàng) - um pingo de esperança.",
              pinyin: "sī",
              frequency: "média",
              simplified: "丝",
              traditional: "絲",
            },
          ],
          pronunciation: "xī wàng",
          common_expressions: [
            {
              pinyin: "yī xiàn xī wàng",
              simplified: "一线希望",
              traditional: "一線希望",
              translation:
                "Um raio de esperança (lit. 'uma linha de esperança').",
            },
            {
              pinyin: "bào zhe xī wàng",
              simplified: "抱着希望",
              traditional: "抱著希望",
              translation:
                "Agarrar-se à esperança (lit. 'abraçar a esperança').",
            },
          ],
        },
      ],
      simplified: "希望",
      traditional: "希望",
      executionTime: 8.108466029167175,
    };

    console.log("[Pinzi] Returning mock data:", mockData);
    return mockData;
  } catch (error) {
    console.error("[Pinzi] Error fetching dictionary data:", error);
    return null;
  }
}

/**
 * Create and show dictionary popup
 */
function createDictionaryPopup(data: DictionaryData, clickEvent: MouseEvent) {
  console.log("[Pinzi] createDictionaryPopup called with data:", data);
  
  // Remove existing popup if any
  const existingDialog = document.getElementById("pinzi-dictionary-dialog") as HTMLDialogElement;
  if (existingDialog) {
    console.log("[Pinzi] Removing existing dialog");
    existingDialog.close();
    existingDialog.remove();
  }

  // Create dialog element
  console.log("[Pinzi] Creating dialog element");
  const dialog = document.createElement("dialog");
  dialog.id = "pinzi-dictionary-dialog";
  dialog.className = "pinzi-dialog";

  // Create dialog content
  const content = `
    <div class="pinzi-dialog-content">
      <div class="pinzi-popup-header">
        <div class="pinzi-popup-title">
          <span class="pinzi-word-simplified">${data.simplified}</span>
          ${
            data.traditional !== data.simplified
              ? `<span class="pinzi-word-traditional">${data.traditional}</span>`
              : ""
          }
        </div>
        <button class="pinzi-popup-close" id="pinzi-popup-close">&times;</button>
      </div>
      <div class="pinzi-popup-body">
        ${data.meanings
          .map(
            (meaning, idx) => `
          <div class="pinzi-meaning" key="${idx}">
            <div class="pinzi-meaning-header">
              <span class="pinzi-word-class">${meaning.class}</span>
              <span class="pinzi-pronunciation">${meaning.pronunciation}</span>
              <span class="pinzi-frequency pinzi-freq-${meaning.frequency}">${
              meaning.frequency
            }</span>
            </div>
            <div class="pinzi-definition">${meaning.definition}</div>
            
            ${
              meaning.usage
                ? `<div class="pinzi-usage"><strong>Uso:</strong> ${meaning.usage}</div>`
                : ""
            }
            
            ${
              meaning.examples && meaning.examples.length > 0
                ? `
              <div class="pinzi-section">
                <div class="pinzi-section-title">Exemplos:</div>
                ${meaning.examples
                  .map(
                    (ex) => `
                  <div class="pinzi-example">
                    <div class="pinzi-example-chinese">
                      ${ex.simplified}
                      ${
                        ex.traditional !== ex.simplified
                          ? `<span class="pinzi-traditional">(${ex.traditional})</span>`
                          : ""
                      }
                    </div>
                    <div class="pinzi-example-pinyin">${ex.pinyin}</div>
                    <div class="pinzi-example-translation">${
                      ex.translation
                    }</div>
                  </div>
                `
                  )
                  .join("")}
              </div>
            `
                : ""
            }
            
            ${
              meaning.synonyms && meaning.synonyms.length > 0
                ? `
              <div class="pinzi-section">
                <div class="pinzi-section-title">Sinônimos:</div>
                <div class="pinzi-related-words">
                  ${meaning.synonyms
                    .map(
                      (syn) => `
                    <div class="pinzi-related-word">
                      <span class="pinzi-related-hanzi">${syn.simplified}</span>
                      <span class="pinzi-related-pinyin">${syn.pinyin}</span>
                      ${
                        syn.usage
                          ? `<div class="pinzi-related-usage">${syn.usage}</div>`
                          : ""
                      }
                    </div>
                  `
                    )
                    .join("")}
                </div>
              </div>
            `
                : ""
            }
            
            ${
              meaning.antonyms && meaning.antonyms.length > 0
                ? `
              <div class="pinzi-section">
                <div class="pinzi-section-title">Antônimos:</div>
                <div class="pinzi-related-words">
                  ${meaning.antonyms
                    .map(
                      (ant) => `
                    <div class="pinzi-related-word">
                      <span class="pinzi-related-hanzi">${ant.simplified}</span>
                      <span class="pinzi-related-pinyin">${ant.pinyin}</span>
                      ${
                        ant.usage
                          ? `<div class="pinzi-related-usage">${ant.usage}</div>`
                          : ""
                      }
                    </div>
                  `
                    )
                    .join("")}
                </div>
              </div>
            `
                : ""
            }
            
            ${
              meaning.classifiers && meaning.classifiers.length > 0
                ? `
              <div class="pinzi-section">
                <div class="pinzi-section-title">Classificadores:</div>
                <div class="pinzi-related-words">
                  ${meaning.classifiers
                    .map(
                      (cls) => `
                    <div class="pinzi-related-word">
                      <span class="pinzi-related-hanzi">${cls.simplified}</span>
                      <span class="pinzi-related-pinyin">${cls.pinyin}</span>
                      ${
                        cls.usage
                          ? `<div class="pinzi-related-usage">${cls.usage}</div>`
                          : ""
                      }
                    </div>
                  `
                    )
                    .join("")}
                </div>
              </div>
            `
                : ""
            }
            
            ${
              meaning.common_expressions &&
              meaning.common_expressions.length > 0
                ? `
              <div class="pinzi-section">
                <div class="pinzi-section-title">Expressões Comuns:</div>
                ${meaning.common_expressions
                  .map(
                    (expr) => `
                  <div class="pinzi-expression">
                    <div class="pinzi-expression-chinese">${expr.simplified}</div>
                    <div class="pinzi-expression-pinyin">${expr.pinyin}</div>
                    <div class="pinzi-expression-translation">${expr.translation}</div>
                  </div>
                `
                  )
                  .join("")}
              </div>
            `
                : ""
            }
            
            ${
              meaning.notes
                ? `<div class="pinzi-notes"><strong>📝 Notas:</strong> ${meaning.notes}</div>`
                : ""
            }
          </div>
        `
           )
           .join('<div class="pinzi-meaning-divider"></div>')}
      </div>
    </div>
  `;

  dialog.innerHTML = content;
  console.log("[Pinzi] Dialog HTML content set");
  
  document.body.appendChild(dialog);
  console.log("[Pinzi] Dialog added to document.body");

  // Add event listeners for closing
  const closeBtn = document.getElementById("pinzi-popup-close");
  
  console.log("[Pinzi] Close button found:", !!closeBtn);

  const closeDialog = () => {
    console.log("[Pinzi] Closing dialog");
    dialog.close();
    setTimeout(() => dialog.remove(), 300);
  };

  closeBtn?.addEventListener("click", closeDialog);

  // Close when clicking on backdrop
  dialog.addEventListener("click", (e) => {
    const dialogDimensions = dialog.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      closeDialog();
    }
  });

  // Show the dialog as modal
  console.log("[Pinzi] Showing dialog as modal");
  dialog.showModal();
  console.log("[Pinzi] Dialog should now be visible");
}

/**
 * Add click listeners to rb elements
 */
function addRbClickListeners(rootElement: Document | Element = document) {
  const rbElements = rootElement.querySelectorAll("rb");

  console.log(
    `[Pinzi] Found ${rbElements.length} rb elements to add listeners to`
  );

  rbElements.forEach((rb, index) => {
    // Skip if already has listener
    if (rb.hasAttribute("data-pinzi-listener")) {
      console.log(`[Pinzi] rb element ${index} already has listener, skipping`);
      return;
    }

    rb.setAttribute("data-pinzi-listener", "true");
    rb.classList.add("pinzi-clickable");

    console.log(
      `[Pinzi] Added listener to rb element ${index}: "${rb.textContent}"`
    );

    rb.addEventListener("click", async (event) => {
      console.log("[Pinzi] Click event fired on rb element!");
      event.preventDefault();
      event.stopPropagation();

      const word = rb.textContent?.trim() || "";
      console.log(`[Pinzi] Clicked word: "${word}"`);

      if (!word) {
        console.log("[Pinzi] No word found, returning");
        return;
      }

      // Show loading state
      console.log("[Pinzi] Creating loading dialog...");
      const loadingDialog = document.createElement("dialog");
      loadingDialog.id = "pinzi-dictionary-dialog";
      loadingDialog.className = "pinzi-dialog";
      loadingDialog.innerHTML = `
        <div class="pinzi-dialog-content">
          <div class="pinzi-popup-loading">
            <div class="pinzi-spinner"></div>
            <div>Carregando dicionário...</div>
          </div>
        </div>
      `;
      document.body.appendChild(loadingDialog);
      loadingDialog.showModal();
      console.log("[Pinzi] Loading dialog shown");

      // Fetch dictionary data
      console.log("[Pinzi] Fetching dictionary data...");
      const data = await fetchDictionaryData(word);
      console.log("[Pinzi] Dictionary data received:", data);

      // Remove loading dialog
      loadingDialog.close();
      loadingDialog.remove();
      console.log("[Pinzi] Loading dialog removed");

      if (data) {
        console.log("[Pinzi] Creating dictionary dialog with data");
        createDictionaryPopup(data, event as MouseEvent);
      } else {
        console.log("[Pinzi] No data received, showing error dialog");
        // Show error message
        const errorDialog = document.createElement("dialog");
        errorDialog.id = "pinzi-dictionary-dialog";
        errorDialog.className = "pinzi-dialog";
        errorDialog.innerHTML = `
          <div class="pinzi-dialog-content">
            <div class="pinzi-popup-header">
              <div class="pinzi-popup-title">Erro</div>
              <button class="pinzi-popup-close" id="error-close-btn">&times;</button>
            </div>
            <div class="pinzi-popup-body">
              <div class="pinzi-error">
                Não foi possível carregar o dicionário para "${word}". 
                Verifique se a API está configurada corretamente.
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(errorDialog);
        errorDialog.showModal();
        
        const errorCloseBtn = document.getElementById("error-close-btn");
        errorCloseBtn?.addEventListener("click", () => {
          errorDialog.close();
          errorDialog.remove();
        });
      }
    });
  });
}

/**
 * Initialize the extension
 */
function init() {
  console.log("=== [Pinzi] Pinyin Extension: Content script loaded ===");
  console.log("[Pinzi] Document ready state:", document.readyState);
  console.log("[Pinzi] Body element exists:", !!document.body);

  // Process existing ruby elements
  console.log("[Pinzi] Processing existing ruby elements...");
  removePinyinForSpecificWords();

  console.log("[Pinzi] Adding click listeners to rb elements...");
  addRbClickListeners();

  // Set up MutationObserver to handle dynamically added content
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        // Only process element nodes
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;

          // Check if the added node itself is a ruby element
          if (element.tagName === "RUBY") {
            removePinyinForSpecificWords(element.parentElement || document);
            addRbClickListeners(element.parentElement || document);
          } else {
            // Check if the added node contains ruby elements
            removePinyinForSpecificWords(element);
            addRbClickListeners(element);
          }
        }
      });
    });
  });

  // Start observing the document for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  console.log(
    `Pinyin Extension: Monitoring for ${WORDS_TO_HIDE_PINYIN.length} words`
  );
}

// Run when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
