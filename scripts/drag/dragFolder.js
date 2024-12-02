let isFolderDropping = false;
async function handleDropFolder(e, destinationFolderId) {
  if (isFolderDropping) return;
  isFolderDropping = true;

  const type = e.dataTransfer.getData("type");
  if (type === "folder") {
    const draggedFolderId = e.dataTransfer.getData("draggedFolderId");
    let { folders = [] } = await chrome.storage.local.get("folders");
    const draggedFolder = folders.find((x) => x.id === draggedFolderId);
    console.log(draggedFolder);

    let draggedIndex, destinationIndex;
    for (let i = 0; i < folders.length; i++) {
      if (folders[i].id === draggedFolderId) draggedIndex = i;
      if (folders[i].id === destinationFolderId) destinationIndex = i + 1;
    }
    console.log(draggedIndex, destinationIndex);
    if (!(destinationIndex >= 0)) destinationIndex = 0;

    // adding
    folders.splice(destinationIndex, 0, draggedFolder);

    // deleting
    draggedIndex > destinationIndex
      ? folders.splice(draggedIndex + 1, 1)
      : folders.splice(draggedIndex, 1);

    chrome.storage.local.set({ folders: folders });

    updateFolders();
    isFolderDropping = false;
  }
  e.target.classList.remove("dragover");
}

function handleDragFolder(e, folderId) {
  e.dataTransfer.setData("type", "folder");
  e.dataTransfer.setData("draggedFolderId", folderId);
}
