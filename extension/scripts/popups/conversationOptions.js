// this function creates a menu where user can delete conversation from a folder
//
// params:
// conversation
// close - method that closes the menu
//
// returns: menu element

function createConversationOptions(conversation, folderId, close) {
  const container = document.createElement("div");
  container.classList.add("options-container");

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("styled-button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    handleConversationDelete(conversation.conversationId, folderId);
    close();
  });

  container.appendChild(deleteButton);

  return container;
}

// this function makes a call to backend and deletes conversation from folder
async function handleConversationDelete(conversationId) {
  await api.deleteConversation(conversationId, folderId);
  await updateFoldersNode();
}
