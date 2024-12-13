async function dropFolder(e, destinationFolderId) {
  const draggedFolderId = e.dataTransfer.getData("draggedFolderId");
  if (draggedFolderId === destinationFolderId) return;

  let { folders = [] } = await chrome.storage.local.get("folders");

  // you can't drag folder inside of any of its children
  const childIds = getChildIdsFromFolders(folders, draggedFolderId);
  if (childIds.some((id) => id === destinationFolderId)) return;

  const draggedFolder = getFolderFromFolders(folders, draggedFolderId);

  folders = removeFolderFromFolders(folders, draggedFolderId);

  const parentFolder = getParentFromFolders(folders, destinationFolderId);

  if (parentFolder) {
    const destinationIndex =
      parentFolder.children.findIndex(
        (child) => child.id === destinationFolderId
      ) + 1;
    parentFolder.children.splice(destinationIndex, 0, draggedFolder);

    folders = replaceFolderInFolders(folders, parentFolder.id, parentFolder);
  } else {
    const destinationIndex =
      folders.findIndex((folder) => folder.id === destinationFolderId) + 1;
    folders.splice(destinationIndex, 0, draggedFolder);
  }

  chrome.storage.local.set({ folders: folders });
}

async function dropFolderToFolder(e, destinationFolderId) {
  const draggedFolderId = e.dataTransfer.getData("draggedFolderId");
  if (draggedFolderId === destinationFolderId) return;

  let { folders = [] } = await chrome.storage.local.get("folders");

  // you can't drag folder inside of any of its children
  const childIds = getChildIdsFromFolders(folders, draggedFolderId);

  if (childIds.some((id) => id === destinationFolderId)) return;

  const folder = getFolderFromFolders(folders, draggedFolderId);

  folders = removeFolderFromFolders(folders, draggedFolderId);

  folders = addFolderToFolders(folders, destinationFolderId, folder);
  console.log(folders);

  chrome.storage.local.set({ folders: folders });
}
