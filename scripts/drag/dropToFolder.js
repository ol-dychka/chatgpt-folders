function handleDropToFolder(e, folderId) {
  const type = e.dataTransfer.getData("type");
  if (type === "chat") {
    handleDropChat(e, folderId);
  } else if (type === "folder") {
    handleDropFolderToFolder(e, folderId);
  }
}
