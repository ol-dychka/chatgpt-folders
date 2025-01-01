document.getElementById("google-auth").addEventListener("click", () => {
  // Send a message to the background script to initiate the Google sign-in flow
  chrome.runtime.sendMessage({ action: "auth" });
});
