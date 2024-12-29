// provides drag-and-drop event (e) with information about dragged folder

function handleDragFolder(e, folder) {
  e.dataTransfer.setData("type", "folder");
  e.dataTransfer.setData("draggedFolderId", folder._id);
}
