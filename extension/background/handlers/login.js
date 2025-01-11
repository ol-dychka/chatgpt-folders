export default async function login() {
  try {
    const nonce = generateNonce();
    const redirectUri = chrome.identity.getRedirectURL();
    const response = await fetch("http://localhost:5000/api/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { url } = await response.json();
    console.log("URL: ", url);
    console.log("redURI: ", redirectUri);
    chrome.identity.launchWebAuthFlow(
      {
        url: `${url}${redirectUri}&nonce=${nonce}`,
        interactive: true,
      },
      async function (redirect_url) {
        if (chrome.runtime.lastError || !redirect_url) {
          console.error(chrome.runtime.lastError);
          return;
        }

        console.log(redirect_url);

        const response = await fetch(
          "http://localhost:5000/api/auth/google/callback",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ redirect_url }),
          }
        );
        console.log("RESP: ", response);
        const data = await response.json();

        if (response.ok) {
          console.log("user: ", data);

          await chrome.storage.local.set({ id: data.id });
          await chrome.storage.local.set({ email: data.email });

          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "update" });
          });
        }
      }
    );
  } catch (error) {
    console.log("Error fetching: ", error);
    throw error;
  }
}

// helper function that is required by google login.
// generates unique string that serves as a proof of uniquenes of the request
function generateNonce() {
  const array = new Uint32Array(10);
  crypto.getRandomValues(array);
  return Array.from(array, (num) => num.toString(36)).join("");
}
