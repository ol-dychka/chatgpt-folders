// async function iterateFolder(folder, folderIndex, folders, indent) {
//   let childrenNode = document.createElement("ul");
//   const folderNode = createFolderNode(folder, childrenNode);
//   childrenNode.hidden = !folder.open;

//   // getting all folders inside
//   if (folder.children) {
//     folder.children.forEach(async (childFolder, childFolderIndex) => {
//       const childFolderNode = await iterateFolder(
//         childFolder,
//         childFolderIndex,
//         folders,
//         indent + 1
//       );
//       childrenNode.appendChild(childFolderNode);
//     });
//   }

//   // getting chats
//   const { [folder.id]: chats = [] } = await chrome.storage.local.get([
//     folder.id,
//   ]);
//   chats.forEach((chat, chatIndex) => {
//     const chatNode = createChatNode(chat, folder);
//     childrenNode.appendChild(chatNode);
//   });

//   folderNode.appendChild(childrenNode);
//   folderNode.style.marginLeft = `${indent * 0.5}rem`;

//   return folderNode;
// }
