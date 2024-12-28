function handleDragFolder(e, folder) {
  e.dataTransfer.setData("type", "folder");
  e.dataTransfer.setData("draggedFolderId", folder._id);
}

let isFolderDropping = false;

async function handleDropFolder(e, destinationFolderId) {
  const type = e.dataTransfer.getData("type");
  if (type === "folder") {
    if (isFolderDropping) return;
    isFolderDropping = true;

    await dropFolder(e, destinationFolderId);

    isFolderDropping = false;
  }
  await updateFoldersNode();
}
