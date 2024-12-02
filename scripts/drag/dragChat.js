let isChatDropping = false;
async function handleDropChat(e, destinationFolderId, destinationChat) {
  if (isChatDropping) return;
  isChatDropping = true;
  e.preventDefault();

  const type = e.dataTransfer.getData("type");
  if (type === "chat") {
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
  }
  e.target.classList.remove("dragover");
}

async function dropChatInDifferentFolder(
  sourceFolderId,
  destinationFolderId,
  draggedChat,
  destinationChat
) {
  const { [destinationFolderId]: destinationFolder = [] } =
    await chrome.storage.local.get([destinationFolderId]);

  const { [sourceFolderId]: sourceFolder = [] } =
    await chrome.storage.local.get([sourceFolderId]);

  let pushIndex = 0;
  for (let i = 0; i < destinationFolder.length; i++) {
    // if chat was dragged onto another chat we want to place it after
    if (destinationFolder[i].href === destinationChat?.href) {
      pushIndex = i + 1;
      console.log("pushed on:", i + 1);
    }
    // checking for duplicate
    if (destinationFolder[i].href === draggedChat.href) return;
  }

  chrome.storage.local.set({
    [sourceFolderId]: sourceFolder.filter((x) => x.href !== draggedChat.href),
  });

  destinationFolder.splice(pushIndex, 0, draggedChat);
  await chrome.storage.local.set({
    [destinationFolderId]: destinationFolder,
  });
}

async function dropChatInSameFolder(folderId, draggedChat, destinationChat) {
  let { [folderId]: folder = [] } = await chrome.storage.local.get([folderId]);

  // the way this is built is that we are filtering out the existing chat from
  // the folder and then appending it to the right index.
  // If chat is located after "target" chat it's all fine,
  // However, if chat is located before "target" chat, filtering the folder
  // messes up the indexing and it has to be reverted by 1.

  let draggedIndex, destinationIndex;
  for (let i = 0; i < folder.length; i++) {
    if (folder[i].href === draggedChat.href) draggedIndex = i;
    if (folder[i].href === destinationChat?.href) destinationIndex = i + 1;
  }

  if (!(destinationIndex >= 0)) destinationIndex = 0;

  // adding
  folder.splice(destinationIndex, 0, draggedChat);

  // deleting
  draggedIndex > destinationIndex
    ? folder.splice(draggedIndex + 1, 1)
    : folder.splice(draggedIndex, 1);

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
