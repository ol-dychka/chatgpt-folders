function handleDragChat(e, conversation, folder) {
  e.dataTransfer.setData("type", "conversation");
  e.dataTransfer.setData("conversationId", conversation.conversationId);
  e.dataTransfer.setData("sourceFolderId", folder._id);
}
