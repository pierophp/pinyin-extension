import { createRoot } from "react-dom/client";
import "./style.css";
import { DictionaryDialog } from "./DictionaryDialog";
import { getToken } from "./helpers/getToken";
import styleText from "./style.css?inline";
import separatePinyinInSyllables from "./helpers/separate-pinyin-in-syllables";

// List of Chinese words that should have their pinyin (ruby text) removed
let WORDS_TO_HIDE_PINYIN: string[] = [];

/**
 * Get tone number from a pinyin syllable
 * Returns 1-4 for tones, 0 for neutral/no tone mark
 */
function getToneFromPinyin(pinyin: string): number {
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

/**
 * Get color for a tone
 * 1st tone: blue, 2nd tone: purple, 3rd tone: green, 4th tone: red, neutral: original
 */
function getColorForTone(tone: number): string {
  switch (tone) {
    case 1:
      return "#3b82f6"; // blue
    case 2:
      return "#a855f7"; // purple
    case 3:
      return "#10b981"; // green
    case 4:
      return "#ef4444"; // red
    default:
      return ""; // neutral - original color
  }
}

/**
 * Apply color spans to rbElement characters based on pinyin tones
 */
function applyToneColorsToRb(
  rbElement: HTMLElement,
  separatedPinyin: string[]
) {
  const text = rbElement.textContent || "";
  const characters = Array.from(text);

  // If no pinyin or mismatch, do nothing
  if (separatedPinyin.length === 0 || characters.length === 0) return;

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

  // Build the HTML with spans
  const html = groups
    .map(({ chars, tone }) => {
      const text = chars.join("");
      const color = getColorForTone(tone);

      if (color) {
        return `<span style="color: ${color}">${text}</span>`;
      }
      return text;
    })
    .join("");

  rbElement.innerHTML = html;
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

    // Find all rt (ruby text) elements and hide them with Tailwind CSS
    const rtElements = ruby.querySelectorAll("rt");

    rtElements.forEach((rt) => {
      const separatedPinyin = separatePinyinInSyllables(rt.textContent);
      console.log(
        `[Pinzi] Hiding rt element: "${rbText}" -> "${separatePinyinInSyllables(
          rt.textContent
        ).join(" ")}"`
      );

      // Apply tone colors to rbElement
      applyToneColorsToRb(rbElement as HTMLElement, separatedPinyin);
      if (WORDS_TO_HIDE_PINYIN.includes(rbText)) {
        rt.classList.add("!hidden");
      }
    });
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
    // Use Pinzi API
    // const API_ENDPOINT = `https://api.pinzi.org/ai/meaning?word=${encodeURIComponent(
    //   word
    // )}&language=pt`;

    const API_ENDPOINT = `https://public-files.pinzi.org/dictionary/pt/${encodeURIComponent(
      word
    )}.json`;
    // console.log(`[Pinzi] Calling API: ${API_ENDPOINT}`);

    const response = await fetch(API_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${await getToken()}`,
      },
    });

    console.log(`[Pinzi] API response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Pinzi] API error response:`, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: DictionaryData = await response.json();
    console.log("[Pinzi] API data received:", data);
    return data;
  } catch (error) {
    console.error("[Pinzi] Error fetching dictionary data:", error);
    return null;
  }
}

async function fetchMyCjk(): Promise<void | null> {
  try {
    // Use Pinzi API
    const API_ENDPOINT = "https://api.pinzi.org/my-cjk";

    const response = await fetch(API_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getToken()}`,
      },
    });

    console.log(`[Pinzi] API response status: ${response.status}`);

    if (response.ok) {
      const data = await response.json();
      return (WORDS_TO_HIDE_PINYIN = data.ideograms);
    }
  } catch (error) {
    console.error("[Pinzi] Error fetching dictionary data:", error);
    return null;
  }
}

// Global reference to the dialog container and root
let dialogContainer: HTMLDivElement | null = null;
let shadowRoot: ShadowRoot | null = null;
let dialogRoot: ReturnType<typeof createRoot> | null = null;

/**
 * Create and show dictionary popup using React with Shadow DOM
 */
function createDictionaryPopup(
  data: DictionaryData | null,
  isLoading: boolean,
  error?: string
) {
  console.log("[Pinzi] createDictionaryPopup called", {
    data,
    isLoading,
    error,
  });

  // Create container with Shadow DOM if it doesn't exist
  if (!dialogContainer) {
    // Create host element
    dialogContainer = document.createElement("div");
    dialogContainer.id = "pinzi-dictionary-root";
    document.body.appendChild(dialogContainer);

    // Attach shadow DOM
    shadowRoot = dialogContainer.attachShadow({ mode: "open" });

    // Inject styles into shadow DOM
    const styleElement = document.createElement("style");
    styleElement.textContent = styleText;
    shadowRoot.appendChild(styleElement);

    // Create a container inside shadow DOM for React
    const shadowContainer = document.createElement("div");
    shadowContainer.id = "shadow-container";
    shadowRoot.appendChild(shadowContainer);

    // Create React root in shadow DOM
    dialogRoot = createRoot(shadowContainer);
  }

  const handleClose = () => {
    console.log("[Pinzi] Closing dialog");
    if (dialogRoot && dialogContainer) {
      dialogRoot.unmount();
      dialogContainer.remove();
      dialogContainer = null;
      shadowRoot = null;
      dialogRoot = null;
    }
  };

  // Render the React component
  dialogRoot?.render(
    <DictionaryDialog
      data={data}
      isLoading={isLoading}
      error={error}
      onClose={handleClose}
    />
  );
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

    // console.log(
    //   `[Pinzi] Added listener to rb element ${index}: "${rb.textContent}"`
    // );

    rb.addEventListener("click", async (event) => {
      console.log("[Pinzi] Click event fired on rb element!");
      // event.preventDefault();
      // event.stopPropagation();

      const word = rb.textContent?.trim() || "";
      console.log(`[Pinzi] Clicked word: "${word}"`);

      if (!word) {
        console.log("[Pinzi] No word found, returning");
        return;
      }

      // Show loading state
      console.log("[Pinzi] Showing loading dialog...");
      createDictionaryPopup(null, true);

      // Fetch dictionary data
      console.log("[Pinzi] Fetching dictionary data...");
      const data = await fetchDictionaryData(word);
      console.log("[Pinzi] Dictionary data received:", data);

      if (data) {
        console.log("[Pinzi] Creating dictionary dialog with data");
        createDictionaryPopup(data, false);
      } else {
        console.log("[Pinzi] No data received, showing error dialog");
        createDictionaryPopup(
          null,
          false,
          `Não foi possível carregar o dicionário para "${word}". Verifique se a API está configurada corretamente.`
        );
      }
    });
  });
}

/**
 * Initialize the extension
 */
async function init() {
  // Process existing ruby elements

  console.log("[Pinzi] Adding click listeners to rb elements...");
  addRbClickListeners();

  await fetchMyCjk();
  console.log("[Pinzi] Processing existing ruby elements...");
  removePinyinForSpecificWords();

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
}

// Run when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
