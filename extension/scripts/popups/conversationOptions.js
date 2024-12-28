function createConversationOptions(conversation, close) {
  const container = document.createElement("div");
  container.classList.add("options-container");

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("styled-button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    handleConversationDelete(conversation.conversationId);
    close();
  });

  container.appendChild(deleteButton);

  return container;
}

async function handleConversationDelete(conversationId) {
  await api.deleteConversation(conversationId);
  await updateFoldersNode();
}
