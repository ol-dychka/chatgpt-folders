// object that containes all the functions
// communicating with backend using custom methods
// all names are pretty self-explanatory

const api = {
  getFolders: async () => getData("folders"),

  getFolder: async (folderId) => getData(`folders/${folderId}`),
  createFolder: async (newFolder) => postData("folders/create", newFolder),
  updateFolder: async (folderId, folderFragment) =>
    postData(`folders/${folderId}`, folderFragment),
  moveFolder: async (folderId, destinationFolderId) =>
    postData(`folders/${folderId}/move`, { destinationFolderId }),
  deleteFolder: async (folderId) => deleteData(`folders/${folderId}`),

  addConversation: async (newConversation) =>
    postData("conversations/create", newConversation),
  moveConversation: async (
    draggedConversationId,
    sourceFolderId,
    destinationFolderId,
    destinationConversationId
  ) =>
    postData(`conversations/${draggedConversationId}`, {
      sourceFolderId,
      destinationFolderId,
      destinationConversationId,
    }),
  deleteConversation: async (conversationId, folderId) =>
    deleteData(`conversations/${conversationId}`, { folderId }),
};
