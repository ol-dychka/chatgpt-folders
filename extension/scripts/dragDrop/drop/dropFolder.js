let isFolderDropping = false;

async function handleDropFolder(e, destinationFolderId) {
  e.preventDefault();
  const type = e.dataTransfer.getData("type");
  if (type === "folder") {
    if (isFolderDropping) return;
    isFolderDropping = true;

    const draggedFolderId = e.dataTransfer.getData("draggedFolderId");

    await api.moveFolder(draggedFolderId, destinationFolderId);

    isFolderDropping = false;
  }
  await updateFoldersNode();
}
