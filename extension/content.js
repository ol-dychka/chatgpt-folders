// temporary measures when auth is not implemented
const USER_ID = "676f3c79ed089a3f03131ff7";

// Observe changes in the DOM using MutationObserver
// for each mutation, append
// 1) folder structure inn the sidebar
// 2) "+" buttons to all conversations
const observer = new MutationObserver(async () => {
  await appendFoldersNode();
  appendButtonsToConversations();
});
observer.observe(document.body, {
  childList: true, // Watch for added/removed elements
  subtree: true, // Include all descendants
});
