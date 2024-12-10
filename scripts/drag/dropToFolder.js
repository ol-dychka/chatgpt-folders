function handleDropToFolder(e, folderId, destinationChat) {
  const type = e.dataTransfer.getData("type");
  if (type === "chat") {
    handleDropChat(e, folderId, destinationChat);
  } else if (type === "folder") {
    handleDropFolderToFolder(e, folderId);
  }
}
