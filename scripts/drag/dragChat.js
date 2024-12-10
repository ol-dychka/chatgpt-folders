let isChatDropping = false;
async function handleDropChat(e, destinationFolderId, destinationChat) {
  if (isChatDropping) return;
  isChatDropping = true;
  e.preventDefault();

  const sourceFolderId = e.dataTransfer.getData("sourceFolderId");
  const draggedChatName = e.dataTransfer.getData("chatName");
  const draggedChatHref = e.dataTransfer.getData("chatHref");
  const draggedChat = {
    href: draggedChatHref,
    name: draggedChatName,
  };

  if (sourceFolderId === destinationFolderId) {
    await dropChatInSameFolder(sourceFolderId, draggedChat, destinationChat);
  } else {
    await dropChatInDifferentFolder(
      sourceFolderId,
      destinationFolderId,
      draggedChat,
      destinationChat
    );
  }

  updateFolders();
  isChatDropping = false;
  e.target.classList.remove("dragover");
}

async function dropChatInDifferentFolder(
  sourceFolderId,
  destinationFolderId,
  draggedChat,
  destinationChat
) {
  let { [destinationFolderId]: destinationFolder = [] } =
    await chrome.storage.local.get([destinationFolderId]);

  let { [sourceFolderId]: sourceFolder = [] } = await chrome.storage.local.get([
    sourceFolderId,
  ]);

  let draggedIndex = sourceFolder.findIndex(
    (chat) => chat.href === draggedChat.href
  );
  sourceFolder.splice(draggedIndex, 1);
  chrome.storage.local.set({
    [sourceFolderId]: sourceFolder,
  });

  let destinationIndex =
    destinationFolder.findIndex((chat) => chat.href === destinationChat.href) +
    1;
  destinationFolder.splice(destinationIndex, 0, draggedChat);
  chrome.storage.local.set({
    [destinationFolderId]: destinationFolder,
  });
}

async function dropChatInSameFolder(folderId, draggedChat, destinationChat) {
  let { [folderId]: folder = [] } = await chrome.storage.local.get([folderId]);
  console.log(folder);
  console.log("same fld chat drop");

  let draggedIndex = folder.findIndex((chat) => chat.href === draggedChat.href);
  folder.splice(draggedIndex, 1);

  let destinationIndex =
    folder.findIndex((chat) => chat.href === destinationChat?.href) + 1;
  console.log("dest: ", destinationIndex);
  folder.splice(destinationIndex, 0, draggedChat);

  chrome.storage.local.set({
    [folderId]: folder,
  });
}

function handleDragChat(e, chat, folder) {
  e.dataTransfer.setData("type", "chat");
  e.dataTransfer.setData("chatName", chat.name);
  e.dataTransfer.setData("chatHref", chat.href);
  e.dataTransfer.setData("sourceFolderId", folder.id);
}
