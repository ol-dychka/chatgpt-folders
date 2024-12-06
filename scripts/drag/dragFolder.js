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

let isFolderToFolderDropping = false;
async function handleDropFolderToFolder(e, destinationFolderId) {
  if (isFolderToFolderDropping) return;
  isFolderToFolderDropping = true;

  const draggedFolderId = e.dataTransfer.getData("draggedFolderId");
  let { folders = [] } = await chrome.storage.local.get("folders");
  console.log(folders);
  console.log("folder in folder Drop");

  const folder = await getFromFolder(folders, draggedFolderId);
  console.log("folder:", folder);

  folders = await removeFromFolder(folders, draggedFolderId);
  console.log("foldersRemoved:", folders);

  folders = await addToFolder(folders, destinationFolderId, folder);
  console.log("foldersAdded:", folders);

  chrome.storage.local.set({ folders: folders });
  updateFolders();

  isFolderToFolderDropping = false;
}

function getFromFolder(folders, folderId) {
  for (let i = 0; i < folders.length; i++) {
    if (folders[i].id === folderId) return folders[i];
    if (folders[i].children) return searchFolder(folders[i].children, folderId);
  }
}

function removeFromFolder(folders, folderId) {
  for (let i = 0; i < folders.length; i++) {
    if (folders[i].id === folderId) {
      folders.splice(i, 1);
      return folders;
    }
    if (folders[i].children) return searchFolder(folders[i].children, folderId);
  }
}

function addToFolder(folders, folderId, folder) {
  for (let i = 0; i < folders.length; i++) {
    if (folders[i].id === folderId) {
      folders[i].children = [...(folders[i].children || []), folder];
      return folders;
    }
    if (folders[i].children) return searchFolder(folders[i].children, folderId);
  }
}
