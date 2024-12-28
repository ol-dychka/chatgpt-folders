const USER_ID = "676f3c79ed089a3f03131ff7";

// Observe changes in the DOM using MutationObserver
const observer = new MutationObserver(async () => {
  await appendFoldersNode();
  appendButtonsToLinks(); // Call the function on every mutation
});
// Start observing the document body for changes
observer.observe(document.body, {
  childList: true, // Watch for added/removed elements
  subtree: true, // Include all descendants
});
