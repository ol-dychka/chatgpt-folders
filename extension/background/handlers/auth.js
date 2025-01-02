export default function auth() {
  chrome.identity.launchWebAuthFlow(
    {
      url: `https://accounts.google.com/o/oauth2/auth?client_id=343447638144-add6qm5ku063v6qvs2rnmfb0fku57e9a.apps.googleusercontent.com&response_type=id_token&redirect_uri=${chrome.identity.getRedirectURL()}&scope=email%20profile`,
      interactive: true,
    },
    async function (redirect_url) {
      if (chrome.runtime.lastError || !redirect_url) {
        console.error(chrome.runtime.lastError);
        return;
      }

      console.log(redirect_url);

      // Extract the access token from the redirect URL
      const urlParams = new URLSearchParams(
        new URL(redirect_url).hash.substring(1)
      );
      const idToken = urlParams.get("id_token"); // ID Token is in the hash fragment

      console.log("ID Token:", idToken);

      // Send the token to the backend for verification
      try {
        const response = await fetch("http://localhost:5000/api/users/auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: idToken }),
        });

        console.log("RESP: ", response);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          await chrome.storage.local.set({ id: data.id });
          await chrome.storage.local.set({ email: data.email });
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(
              tabs[0].id,
              { action: "update" },
              function (response) {}
            );
          });
        }
      } catch (error) {
        console.log("Error fetching: ", error);
        throw error;
      }
    }
  );
}
