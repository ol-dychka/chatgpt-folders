let isConversationDropping = false;

async function handleDropConversation(
  e,
  destinationFolderId,
  destinationConversationId
) {
  e.preventDefault();
  const type = e.dataTransfer.getData("type");
  if (type === "conversation") {
    if (isConversationDropping) return;
    isConversationDropping = true;

    const sourceFolderId = e.dataTransfer.getData("sourceFolderId");
    const draggedConversationId = e.dataTransfer.getData("conversationId");

    await api.moveConversation(
      draggedConversationId,
      sourceFolderId,
      destinationFolderId,
      destinationConversationId
    );

    isConversationDropping = false;
    await updateFoldersNode();
  }
}
