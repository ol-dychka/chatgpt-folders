// provides drag-and-drop event (e) with information about
// dragged conversation and source folder

function handleDragConversation(e, conversationId, folderId) {
  e.dataTransfer.setData("type", "conversation");
  e.dataTransfer.setData("conversationId", conversationId);
  e.dataTransfer.setData("sourceFolderId", folderId);
}
