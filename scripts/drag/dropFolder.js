async function dropFolder(e, destinationFolderId) {
  const draggedFolderId = e.dataTransfer.getData("draggedFolderId");
  let { folders = [] } = await chrome.storage.local.get("folders");

  // you can't drag folder inside of any of its children
  const childIds = getChildIdsFromFolders(folders, draggedFolderId, [], false);
  if (childIds.some((id) => id === destinationFolderId)) return;

  const draggedFolder = getFolderFromFolders(folders, draggedFolderId);

  folders = removeFolderFromFolders(folders, draggedFolderId);

  const parentFolder = getParentFromFolders(folders, destinationFolderId);
  console.log(parentFolder);

  const destinationIndex = parentFolder.children.findIndex(
    (child) => child.id === destinationFolderId
  );
  parentFolder.children.splice(destinationIndex + 1, 0, draggedFolder);

  folders = replaceFolderInFolders(folders, parentFolder.id, parentFolder);
  console.log(folders);

  chrome.storage.local.set({ folders: folders });
}

async function dropFolderToFolder(e, destinationFolderId) {
  const draggedFolderId = e.dataTransfer.getData("draggedFolderId");
  let { folders = [] } = await chrome.storage.local.get("folders");

  // you can't drag folder inside of any of its children
  const childIds = getChildIdsFromFolders(folders, draggedFolderId, [], false);
  if (childIds.some((id) => id === destinationFolderId)) return;

  const folder = getFolderFromFolders(folders, draggedFolderId);

  folders = removeFolderFromFolders(folders, draggedFolderId);

  folders = addFolderToFolders(folders, destinationFolderId, folder);
  console.log(folders);

  chrome.storage.local.set({ folders: folders });
}
