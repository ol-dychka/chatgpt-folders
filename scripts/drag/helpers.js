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
