const api = {
  getFolders: async () => getData("folders"),

  getFolder: async (folderId) => getData(`folders/${folderId}`),
  createFolder: async (newFolder) => postData("folders/create", newFolder),
  updateFolder: async (folderId, oldFolder, fragmentedFolder) =>
    postData(`folders/${folderId}`, { ...oldFolder, ...fragmentedFolder }),
  deleteFolder: async (folderId) => deleteData(`folders/${folderId}`),
};
