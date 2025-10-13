# Quick Start Guide - Chinese Pinyin Hider Extension

## What This Extension Does

This extension has two main features:

1. **Pinyin Hiding**: Automatically removes pinyin (ruby text annotations) for specific Chinese words that you already know, helping you practice reading characters without the training wheels!

2. **Dictionary Popup**: Click on any Chinese word (inside `<rb>` tags) to see a comprehensive dictionary definition with examples, synonyms, antonyms, and more!

## Quick Setup

### 1. Install Dependencies

```bash
npm install
# or
bun install
```

### 2. Build the Extension

```bash
npm run build
```

### 3. Load in Chrome

1. Open Chrome and go to `chrome://extensions`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `dist_chrome` folder

### 4. Configure Dictionary API (Optional)

To enable the dictionary popup feature:

1. Open `src/pages/content/index.tsx`
2. Find line ~81: `const API_ENDPOINT = "YOUR_API_ENDPOINT_HERE";`
3. Replace with your dictionary API endpoint
4. See `API_SETUP.md` for detailed API configuration

**Note:** The pinyin hiding feature works without an API. The dictionary popup requires API setup.

### 5. Test It!

Open the included `test.html` file in your browser to see it in action. Try clicking on Chinese words to test the dictionary popup!

## Customizing Your Word List

**File:** `src/pages/content/index.tsx`

Find this section around line 4:

```typescript
const WORDS_TO_HIDE_PINYIN: string[] = [
  "上帝",
  "最初",
  // Add more words here
];
```

### Adding Words:

1. Open `src/pages/content/index.tsx`
2. Add your words to the array
3. Rebuild: `npm run build`
4. Reload the extension in Chrome (click refresh icon on `chrome://extensions`)

### Example - Adding common greetings:

```typescript
const WORDS_TO_HIDE_PINYIN: string[] = [
  "上帝",
  "最初",
  "你好", // hello
  "谢谢", // thank you
  "再见", // goodbye
  "早上好", // good morning
];
```

## Development Mode

For active development with hot reload:

```bash
npm run dev
```

This watches for file changes and automatically rebuilds the extension.

## How It Works

The extension:

1. Scans the page for all `<ruby>` elements (used for showing pronunciation)
2. Checks if the `<rb>` (ruby base - the Chinese text) matches any word in your list
3. If it matches, clears the `<rt>` (ruby text - the pinyin)
4. Monitors for dynamically loaded content using MutationObserver

## Common Use Cases

### Learning Platform

You're using a Chinese learning website that shows pinyin for everything. As you master words, add them to your list to challenge yourself.

### Reading Practice

Remove pinyin from words you know to force yourself to read the characters without help.

### Progressive Learning

Start with an empty list, and gradually add words as you learn them.

## Troubleshooting

### Extension not working?

1. Check console: Right-click page → Inspect → Console tab
2. Look for "Pinyin Extension: Content script loaded"
3. Verify the word exists in your list with exact spelling
4. Make sure the website uses `<ruby>` tags (not all do)

### Changes not appearing?

1. Rebuild: `npm run build`
2. Refresh extension on `chrome://extensions` page
3. Reload the webpage you're testing

## File Structure

```
src/pages/content/index.tsx  ← Main extension logic (edit word list here!)
manifest.json                ← Extension metadata
test.html                    ← Test page with examples
```

## Next Steps

- Add your frequently used words to the list
- Test on your favorite Chinese learning sites
- Consider creating a popup UI to manage the word list dynamically (future enhancement!)

Happy learning! 加油！
