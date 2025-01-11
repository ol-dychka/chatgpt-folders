import postData from "./postData.js";

export default async function login() {
  try {
    const nonce = generateNonce();
    const redirectUri = chrome.identity.getRedirectURL();
    const { url } = await postData("auth/google");
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

        const data = await postData("auth/google/callback", {
          redirect_url,
        });

        console.log("user: ", data);

        await chrome.storage.local.set({ id: data.id });
        await chrome.storage.local.set({ email: data.email });

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { action: "update" });
        });
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
