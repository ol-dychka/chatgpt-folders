// when user is logged in, his database ID is stored in local storage
// this is not very secure and it will get replaced in production
let USER_ID;
async function getUserId() {
  const { id } = await chrome.storage.local.get("id");
  USER_ID = id;
}

// set theme color
function setConversationHoverColor(theme) {
  if (theme === "dark") {
    document.documentElement.style.setProperty("--hover-color", "#212121");
    document.documentElement.style.setProperty("--text-color", "#ececec");
    document.documentElement.style.setProperty(
      "--text-inactive-color",
      "#b4b4b4"
    );
    document.documentElement.style.setProperty("--bg-color", "#212121");
    document.documentElement.style.setProperty("--input-color", "#2f2f2f");
  } else {
    document.documentElement.style.setProperty("--hover-color", "#ececec");
    document.documentElement.style.setProperty("--text-color", "#000000");
    document.documentElement.style.setProperty(
      "--text-inactive-color",
      "#5d5d5d"
    );
    document.documentElement.style.setProperty("--bg-color", "#ffffff");
    document.documentElement.style.setProperty("--input-color", "#f4f4f4");
  }
}
setConversationHoverColor(document.documentElement.className);

// Observe changes in the DOM using MutationObserver
// for each mutation, append
// 1) folder structure inn the sidebar
// 2) "+" buttons to all conversations
const observer = new MutationObserver(async () => {
  await getUserId();
  await appendFoldersNode();
  appendButtonsToConversations();
});
observer.observe(document.body, {
  childList: true, // Watch for added/removed elements
  subtree: true, // Include all descendants
});

// observes changes of theme
const themeObserver = new MutationObserver(() => {
  setConversationHoverColor(document.documentElement.className);
});
themeObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["class"],
});

// function runs when user is logged in / logged out
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "update") {
    // Call your content script function here
    await getUserId();
    await updateFoldersNode();
  } else if (message.action === "reload") {
    location.reload();
  }
});
