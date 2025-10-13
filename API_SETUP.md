# API Setup Guide for Dictionary Feature

## Overview

The dictionary popup feature requires an API endpoint that returns dictionary data for Chinese words. This guide will help you set up the API connection.

## API Configuration

### 1. Set Your API Endpoint

Open `src/pages/content/index.tsx` and find line ~81:

```typescript
const API_ENDPOINT = "YOUR_API_ENDPOINT_HERE";
```

Replace with your actual API endpoint:

```typescript
const API_ENDPOINT = "https://your-api.com/dictionary";
```

### 2. API Request Format

The extension will make a GET request to your API:

```
GET https://your-api.com/dictionary?word=希望
```

Query parameters:

- `word`: The Chinese word to look up (URL encoded)

### 3. Expected API Response Format

Your API should return JSON in this format:

```json
{
  "simplified": "希望",
  "traditional": "希望",
  "meanings": [
    {
      "class": "verbo",
      "definition": "esperar; desejar",
      "pronunciation": "xī wàng",
      "frequency": "alta",
      "usage": "Usado para expressar um desejo...",
      "examples": [
        {
          "simplified": "我 希望 明天 天气 好。",
          "traditional": "我 希望 明天 天氣 好。",
          "pinyin": "wǒ xī wàng míng tiān tiān qì hǎo.",
          "translation": "Espero que amanhã faça bom tempo."
        }
      ],
      "synonyms": [
        {
          "simplified": "盼望",
          "traditional": "盼望",
          "pinyin": "pàn wàng",
          "frequency": "média",
          "usage": "Significa 'ansiar por'..."
        }
      ],
      "antonyms": [...],
      "classifiers": [...],
      "common_expressions": [...]
    }
  ],
  "executionTime": 8.1
}
```

### Required Fields

**Root level:**

- `simplified` (string): Simplified Chinese characters
- `traditional` (string): Traditional Chinese characters
- `meanings` (array): Array of meaning objects

**Meaning object:**

- `class` (string): Word class (verbo, substantivo, adjetivo, etc.)
- `definition` (string): Definition in your target language
- `pronunciation` (string): Pinyin pronunciation
- `frequency` (string): Word frequency ("alta", "média", "baixa")

**Optional fields:**

- `usage` (string): Usage notes
- `examples` (array): Example sentences
- `synonyms` (array): Synonym words
- `antonyms` (array): Antonym words
- `classifiers` (array): Classifier words (for nouns)
- `common_expressions` (array): Common expressions
- `notes` (string): Additional notes

### 4. Testing with Mock Data

For testing without a backend API, you can temporarily replace the `fetchDictionaryData` function with mock data:

```typescript
async function fetchDictionaryData(
  word: string
): Promise<DictionaryData | null> {
  // Mock data for testing
  if (word === "希望") {
    return {
      simplified: "希望",
      traditional: "希望",
      meanings: [
        {
          class: "verbo",
          definition: "esperar; desejar",
          pronunciation: "xī wàng",
          frequency: "alta",
          usage: "Usado para expressar um desejo ou expectativa.",
          examples: [
            {
              simplified: "我 希望 明天 天气 好。",
              traditional: "我 希望 明天 天氣 好。",
              pinyin: "wǒ xī wàng míng tiān tiān qì hǎo.",
              translation: "Espero que amanhã faça bom tempo.",
            },
          ],
        },
      ],
    };
  }

  return null;
}
```

## CORS Considerations

If your API is hosted on a different domain, you may need to:

1. Configure CORS headers on your API server
2. Add the API domain to `host_permissions` in `manifest.json`:

```json
{
  "host_permissions": ["https://your-api.com/*"]
}
```

## Error Handling

The extension handles these error scenarios:

- Network errors
- API returning non-200 status
- Invalid JSON response
- Missing required fields

Users will see an error message popup if the dictionary lookup fails.

## Performance Tips

1. **Caching**: Consider implementing client-side caching to avoid repeated API calls for the same word
2. **Debouncing**: If you add a "hover" feature later, implement debouncing to reduce API calls
3. **Loading State**: The extension shows a loading spinner while fetching data

## Security

⚠️ **Important**: Never hardcode API keys in the content script. If your API requires authentication:

1. Store API keys in the extension's background script
2. Have the content script message the background script
3. Make API calls from the background script
4. Send the result back to the content script

Example architecture:

```
Content Script → Message → Background Script → API Call → Response → Content Script
```

## Need Help?

If you're building your own dictionary API, consider:

- Using existing Chinese dictionaries like CC-CEDICT
- Building with Node.js/Express or Python/FastAPI
- Deploying on Vercel, Railway, or similar platforms
