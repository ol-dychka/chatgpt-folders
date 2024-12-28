// async function handleDropToFolder(e, folderId, destinationChat) {
//   const type = e.dataTransfer.getData("type");
//   if (type === "chat") {
//     if (isChatDropping) return;
//     isChatDropping = true;

//     await dropChat(e, folderId, destinationChat);

//     isChatDropping = false;
//   } else if (type === "folder") {
//     if (isFolderDropping) return;
//     isFolderDropping = true;

//     await dropFolderToFolder(e, folderId);

//     isFolderDropping = false;
//   }
//   await updateFoldersNode();
// }

// async function handleDropOutside(e) {
//   const type = e.dataTransfer.getData("type");
//   if (type === "folder") {
//     if (isFolderDropping) return;
//     isFolderDropping = true;

//     await dropFolderOutside(e);

//     isFolderDropping = false;
//   }
//   await updateFoldersNode();
// }
