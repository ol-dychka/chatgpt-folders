const api = {
  getFolders: async () => getData("folders"),

  getFolder: async (folderId) => getData(`folders/${folderId}`),
  createFolder: async (newFolder) => postData("folders/create", newFolder),
  updateFolder: async (folderId, folderFragment) =>
    postData(`folders/${folderId}`, folderFragment),
  deleteFolder: async (folderId) => deleteData(`folders/${folderId}`),

  addConversation: async (newConversation) =>
    postData("conversations/create", newConversation),
  changeConversationFolder: async (conversationId, oldFolderId, newFolderId) =>
    postData(`conversations/${conversationId}`, { oldFolderId, newFolderId }),
  deleteConversation: async (conversationId) =>
    deleteData(`conversations/${conversationId}`),

  // there may be some problems with camelCase used here and snake_case used in backend
};
