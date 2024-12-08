let isFolderDropping = false;
// handles drop in-between folders
async function handleDropFolder(e, destinationFolderId) {
  const type = e.dataTransfer.getData("type");
  if (type === "folder") {
    if (isFolderDropping) return;
    isFolderDropping = true;

    const draggedFolderId = e.dataTransfer.getData("draggedFolderId");
    if (draggedFolderId === destinationFolderId) return;

    let { folders = [] } = await chrome.storage.local.get("folders");

    // get dragged folder
    const draggedFolder = getFolderFromFolders(folders, draggedFolderId);

    // remove dragged folder from folder tree
    folders = removeFolderFromFolders(folders, draggedFolderId);

    // get parent folder of a "destination" folder
    const parentFolder = getParentFromFolders(folders, destinationFolderId);
    console.log(parentFolder);

    const destinationIndex = parentFolder.children.findIndex(
      (child) => child.id === destinationFolderId
    );
    parentFolder.children.splice(destinationIndex + 1, 0, draggedFolder);

    folders = replaceFolderInFolders(folders, parentFolder.id, parentFolder);
    console.log(folders);

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

async function handleDropFolderToFolder(e, destinationFolderId) {
  if (isFolderDropping) return;
  isFolderDropping = true;

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
  updateFolders();
  isFolderDropping = false;
}

function getFolderFromFolders(folders, targetFolderId) {
  for (let folder of folders) {
    if (folder.id === targetFolderId) return folder;

    if (folder.children && folder.children.length > 0) {
      const result = getFolderFromFolders(folder.children, targetFolderId);
      if (result) return result;
    }
  }
  return null;
}

function removeFolderFromFolders(folders, targetFolderId) {
  return folders.filter((folder) => {
    if (folder.id === targetFolderId) return false;

    if (folder.children && folder.children.length > 0) {
      folder.children = removeFolderFromFolders(
        folder.children,
        targetFolderId
      );
    }

    return true;
  });
}

function addFolderToFolders(folders, destinationFolderId, newFolder) {
  folders.forEach((folder) => {
    if (folder.id === destinationFolderId) {
      if (!folder.children) folder.children = [];
      folder.children.unshift(newFolder);
    }

    if (folder.children && folder.children.length > 0) {
      addFolderToFolders(folder.children, destinationFolderId, newFolder);
    }
  });

  return folders;
}

function getParentFromFolders(folders, targetFolderId) {
  for (let folder of folders) {
    if (folder.children && folder.children.length > 0) {
      if (folder.children.some((child) => child.id === targetFolderId))
        return folder;

      // else
      const result = getParentFromFolders(folder.children, targetFolderId);
      if (result) return result;
    }
  }
  return null;
}

function replaceFolderInFolders(folders, targetFolderId, newFolder) {
  return folders.map((folder) => {
    if (folder.id === targetFolderId) return newFolder;

    if (folder.children && folder.children.length > 0) {
      folder.children = replaceFolderInFolders(
        folder.children,
        targetFolderId,
        newFolder
      );
    }

    return folder;
  });
}

function getChildIdsFromFolders(folders, targetFolderId, ids, canIterate) {
  folders.forEach((folder) => {
    if (folder.id === targetFolderId || canIterate) {
      ids.push(folder.id);
      if (folder.children && folder.children.length > 0) {
        getChildIdsFromFolders(folder.children, targetFolderId, ids, true);
      }
    }
  });
  return ids;
}
