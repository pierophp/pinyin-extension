let token: string | null = null;

export async function getToken(): Promise<string> {
  if (token) {
    return token;
  }

  console.log("[Pinzi] Requesting token from background script...");
  // Get token from background script (content scripts can't access chrome.cookies)
  const tokenResponse = await chrome.runtime.sendMessage({
    action: "getCookie",
  });
  console.log("[Pinzi] Token response:", tokenResponse);

  if (!tokenResponse.success || !tokenResponse.token) {
    console.error(
      "[Pinzi] Failed to get token. Please log in to editor.pinzi.org"
    );
    throw new Error(
      "Authentication required. Please log in to editor.pinzi.org"
    );
  }

  token = tokenResponse.token;

  return token!;
}
