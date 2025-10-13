<div align="center">
<img src="public/icon-128.png" alt="logo"/>
<h1>Chinese Pinyin Hider Extension</h1>

<h5>
A browser extension that hides pinyin (ruby annotations) for specific Chinese words you already know.
<br/>
Perfect for Chinese learners who want to gradually remove training wheels as they learn more characters!
</h5>

</div>

## About

This extension automatically removes pinyin annotations from specific Chinese words across all web pages. When learning Chinese, seeing pinyin can be helpful, but as you learn more words, you may want to hide the pinyin for words you already know to challenge yourself and improve character recognition.

### Features

- 🎯 **Pinyin Hiding**: Automatically hides pinyin for configured Chinese words
- 📖 **Dictionary Popup**: Click any Chinese word to see comprehensive definitions
- 🔄 Works on dynamically loaded content
- ⚡ Lightweight and fast
- 🌐 Works on all websites with ruby annotations
- 🎨 Beautiful, modern UI with smooth animations

### How it works

**Pinyin Hiding:**
The extension searches for all `<ruby>` elements on the page. If the `<rb>` (ruby base) element contains text from your configured word list, it clears the `<rt>` (pinyin) element, effectively hiding the pronunciation guide.

**Dictionary Popup:**
Click on any `<rb>` element to fetch and display comprehensive dictionary information including:

- Multiple meanings and word classes
- Usage examples with translations
- Synonyms and antonyms
- Common expressions
- Pronunciation and frequency information

## Table of Contents

- [Customizing Word List](#customizing-word-list)
- [Dictionary API Setup](#dictionary-api-setup)
- [Usage](#usage)
  - [Getting Started](#gettingStarted)
  - [Testing](#testing)
  - [Customization](#customization)
  - [Publish](#publish)
- [Tech Stack](#tech)
- [Contributing](#contributing)

## Customizing Word List <a name="customizing-word-list"></a>

To customize which words should have their pinyin hidden:

1. Open `src/pages/content/index.tsx`
2. Find the `WORDS_TO_HIDE_PINYIN` array (around line 4)
3. Add or remove Chinese words as needed:

```typescript
const WORDS_TO_HIDE_PINYIN: string[] = [
  "上帝",
  "最初",
  "你好",
  "谢谢",
  // Add more words here
];
```

4. Rebuild the extension with `npm run build` or `npm run dev`

## Dictionary API Setup <a name="dictionary-api-setup"></a>

The dictionary popup feature requires a backend API to fetch word definitions.

### Quick Setup:

1. Open `src/pages/content/index.tsx`
2. Find line ~81: `const API_ENDPOINT = "YOUR_API_ENDPOINT_HERE";`
3. Replace with your dictionary API URL:
   ```typescript
   const API_ENDPOINT = "https://your-api.com/dictionary";
   ```
4. Rebuild the extension

### API Requirements:

Your API should:

- Accept GET requests with a `word` query parameter
- Return JSON matching the structure in `API_SETUP.md`
- Support CORS for browser requests

See `API_SETUP.md` for complete API specification, response format, and example implementation.

### Without an API:

The pinyin hiding feature works without an API. The dictionary popup will show an error message if no API is configured. You can still use the extension for pinyin hiding only.

## Tech Stack <a name="tech"></a>

- [React 19](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Chrome Extension Manifest Version 3](https://developer.chrome.com/docs/extensions/mv3/intro/)

## Usage <a name="usage"></a>

### Getting Started <a name="gettingStarted"></a>

#### Developing and building

1. Clone this repository
2. Run `npm install` or `bun install` (Node.js >= 16 required)
3. Run `npm run dev` or `npm run dev:chrome` for development with hot reload
4. For production build: `npm run build` or `npm run build:chrome`

Running a `dev` command will build your extension and watch for changes in the
source files. Changing the source files will refresh the corresponding
`dist_chrome` folder.

#### Load your extension

**For Chrome:**

1. Open Chrome browser
2. Navigate to [chrome://extensions](chrome://extensions)
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `dist_chrome` folder in this project

**For Firefox:**

1. Open Firefox browser
2. Navigate to [about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox)
3. Click "Load Temporary Add-on"
4. Select any file in `dist_firefox` folder (e.g., `manifest.json`)

### Testing <a name="testing"></a>

A test HTML file is included at `test.html` with various test cases:

1. Build and load the extension (see above)
2. Open `test.html` in your browser
3. Verify that:
   - Words in the hide list (上帝, 最初) show NO pinyin
   - Other words show pinyin normally
   - Dynamically added content is also processed

You can also test on real Chinese learning websites that use ruby annotations.

### Customization <a name="customization"></a>

#### Adding / removing pages

The template includes source code for **all** of the extension pages (i.e. New Tab, Dev Tools, Popup, Side Panel
etc.). You will likely have to customize it to fit your needs.

E.g. you don't want the newtab page to activate whenever you open a new tab:

1. remove the directory `newtab` and its contents in `src/pages`
2. remove `chrome_url_overrides: { newtab: 'src/pages/newtab/index.html' },` in `manifest.json`

Some pages like the "Side Panel" don't work the exact same in Chrome and Firefox. While this template includes
the source code for the side panel, it won't automatically be included in the dist file to prevent cross browser
build warnings.

To include the side panel for Chrome add the following to the `manifest.json`:

```typescript
{
  "manifest_version": 3,
  // ...
  "permissions": [
    "activeTab",
    "sidePanel" // <-- permission for sidepanel
  ],
  // ...
  "side_panel": {
    "default_path": "src/pages/panel/index.html" // <-- tell vite to include it in the build files
  },
  // ...
}
```

If you need to declare pages in addition to the manifest pages, e.g. a custom `app` page, create a
new folder in the `pages` directory and add the corresponding `.html`, `.tsx` and `.css`
files (see `options/*` for an example to copy). Then include the root html in the `vite.config.base.ts`
file under `build.rollupOptions.input` like so:

```typescript
// ...
build: {
   rollupOptions: {
      input: {
         app: resolve(pagesDir, "app", "index.html"),
      },
      output: {
         entryFileNames: (chunk) => `src/pages/${chunk.name}/index.js`,
      },
   },
}
// ...
```

#### Styling

CSS files in the `src/pages/*` directories are not necessary. They are left in there in case you want
to use it in combination with Tailwind CSS. **Feel free to delete them**.

Tailwind can be configured, themed and extended according to the [docs](https://tailwindcss.com/docs/theme).

#### Internationalization (i18n)

To enable internationalization set the `localize` flag in the `vite.config.base.ts` to `true`.

The template includes a directory `locales` with a basic setup for english i18n. Enabling i18n
will pull the name and description for your extension from the english translation files instead
of the manifest.

Follow the instructions in the [official docs](https://developer.chrome.com/docs/extensions/reference/api/i18n#description)
to add other translations and retrieve them in the extension.

If you don't need i18n you can ignore the `locales` directory until you need it, as it won't
be copied into the build folder unless the `localize` flag is set to `true`.

### Publish your extension to the CWS<a name="publish"></a>

To upload an extension to the Chrome store you have to pack (zip) it and then upload it to your item
in the Chrome Web Store.

This repo includes a Github Action Workflow to create a
[optimized prod build and the zip file](https://github.com/JohnBra/vite-web-extension/actions/workflows/ci.yml).

To run the workflow do the following:

1. Go to the **"Actions"** tab in your forked repository from this template
2. In the left sidebar click on **"Build and Zip Chrome Extension"**
3. Click on **"Run Workflow"** and select the main branch, then **"Run Workflow"**
4. Refresh the page and click the most recent run
5. In the summary page **"Artifacts"** section click on the generated **"vite-web-extension-chrome"**
6. Upload this file to the Chrome Web Store as described [here](https://developer.chrome.com/docs/webstore/publish/)

# Tech Docs <a name="tech"></a>

- [Vite](https://vitejs.dev/)
- [Vite Plugins](https://vitejs.dev/guide/api-plugin.html)
- [Chrome Extension with manifest 3](https://developer.chrome.com/docs/extensions/mv3/)
- [Chrome Extension i18n](https://developer.chrome.com/docs/extensions/reference/api/i18n#description)
- [Cross browser development with webextension-polyfill](https://github.com/mozilla/webextension-polyfill?tab=readme-ov-file#webextension-browser-api-polyfill)
- [@crxjs/vite-plugin](https://crxjs.dev/vite-plugin)
- [Rollup](https://rollupjs.org/guide/en/)
- [Tailwind CSS 4](https://tailwindcss.com/docs/configuration)

# Contributing <a name="contributing"></a>

Feel free to open PRs or raise issues!
