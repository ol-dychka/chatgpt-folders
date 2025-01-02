document.getElementById("google-auth").addEventListener("click", () => {
  // Send a message to the background script to initiate the Google sign-in flow
  chrome.runtime.sendMessage({ action: "auth" });
});

const label = document.getElementById("label");
chrome.storage.local.get("email").then(({ email }) => {
  if (email) label.innerText = `Logged in as ${email}`;
});
