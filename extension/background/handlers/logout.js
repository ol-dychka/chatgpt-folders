export default async function logout() {
  await chrome.storage.local.remove("id", () => {});
  await chrome.storage.local.remove("email", () => {});
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "update" });
  });
}
