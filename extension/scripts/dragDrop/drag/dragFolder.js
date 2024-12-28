function handleDragFolder(e, folder) {
  e.dataTransfer.setData("type", "folder");
  e.dataTransfer.setData("draggedFolderId", folder._id);
}
