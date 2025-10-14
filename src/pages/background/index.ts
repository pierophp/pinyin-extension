console.log("[Pinzi Background] Background script loaded");

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("[Pinzi Background] Received message:", request);

  if (request.action === "getCookie") {
    // Get the cookie from editor.pinzi.org
    chrome.cookies.get(
      {
        url: "https://editor.pinzi.org",
        name: "token",
      },
      (cookie) => {
        console.log("[Pinzi Background] Cookie retrieved:", cookie);
        if (chrome.runtime.lastError) {
          console.error(
            "[Pinzi Background] Error getting cookie:",
            chrome.runtime.lastError
          );
          sendResponse({
            success: false,
            error: chrome.runtime.lastError.message,
          });
        } else {
          sendResponse({ success: true, token: cookie?.value });
        }
      }
    );

    // Return true to indicate we'll send response asynchronously
    return true;
  }
});
