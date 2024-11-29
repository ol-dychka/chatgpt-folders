function createFolderNode(folder, chatsNode) {
  const folderNode = document.createElement("li");

  const folderHeader = document.createElement("div");
  folderHeader.classList.add("folder-header");
  // folderHeader.style.backgroundColor = folder.color;
  // folderHeader.style.color = getContrastColor(folder.color);

  const folderName = document.createElement("div");
  folderName.classList.add("folder-name");
  folderName.innerText = folder.name;

  const optionsButton = document.createElement("button");
  optionsButton.classList.add("inline-text-button");
  optionsButton.innerText = "•••";
  optionsButton.addEventListener("click", (e) =>
    attachPopup(
      (close) => createFolderOptions(folder, folderName, optionsButton, close),
      e
    )
  );

  const toggleButton = document.createElement("button");
  toggleButton.classList.add("toggle-open-button", "inline-button");
  toggleButton.innerText = "›";
  if (folder.open) toggleButton.classList.add("toggle-open-button-rotated");
  toggleButton.addEventListener("click", () =>
    toggleFolder(folder, toggleButton, folderHeader, chatsNode)
  );

  //check if folder is open
  if (folder.open) {
    toggleButton.classList.add("toggle-open-button-rotated");
    folderHeader.classList.add("folder-header-open");
  } else {
    toggleButton.classList.remove("toggle-open-button-rotated");
    folderHeader.classList.remove("folder-header-open");
  }

  folderHeader.appendChild(toggleButton);
  folderHeader.appendChild(folderName);
  folderHeader.appendChild(optionsButton);
  folderNode.appendChild(folderHeader);

  folderNode.addEventListener("dragover", (e) => e.preventDefault(), false);
  folderNode.addEventListener("drop", (e) => handleDrop(e, folder.id), false);

  return folderNode;
}

function createChatNode(chat, folder) {
  const chatNode = document.createElement("li");
  const chatHeader = document.createElement("div");
  const chatText = document.createElement("div");
  chatText.classList.add("chat-text");
  chatText.draggable = true;

  const link = document.createElement("a");
  link.href = chat.href;
  link.innerText = chat.name;
  link.target = "_self";

  const optionsButton = document.createElement("button");
  optionsButton.classList.add("inline-text-button");
  optionsButton.innerText = "•••";
  optionsButton.addEventListener("click", (e) =>
    attachPopup(
      (close) => createChatOptions(chat, folder.id, chatHeader, close),
      e
    )
  );

  chatText.appendChild(link);
  chatText.appendChild(optionsButton);
  chatText.addEventListener("dragstart", (e) => handleDrag(e, chat, folder));

  chatHeader.appendChild(chatText);

  const gap = document.createElement("div");
  gap.classList.add("chat-gap");

  gap.addEventListener("dragover", (e) => e.preventDefault(), false);
  gap.addEventListener(
    "drop",
    async (e) => handleDrop(e, folder.id, chat),
    false
  );
  gap.addEventListener("dragenter", (e) => e.target.classList.add("dragover"));
  gap.addEventListener("dragleave", (e) =>
    e.target.classList.remove("dragover")
  );

  chatNode.appendChild(gap);
  chatNode.appendChild(chatHeader);

  return chatNode;
}

function createFolderOptions(folder, folderNameNode, optionsButton, close) {
  const container = document.createElement("div");
  container.classList.add("options-container");

  const editButton = document.createElement("button");
  editButton.classList.add("styled-button");
  editButton.innerText = "Edit";
  editButton.addEventListener("click", () => {
    handleEditFolderName(folderNameNode, editButton, optionsButton);
    close();
  });

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("styled-button");
  deleteButton.innerText = "Delete";
  deleteButton.addEventListener("click", () => {
    handleDeleteFolder(folder.id);
    close();
  });

  container.appendChild(editButton);
  container.appendChild(deleteButton);

  return container;
}

function createChatOptions(chat, folderId, chatNode, close) {
  const container = document.createElement("div");
  container.classList.add("options-container");

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("styled-button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    handleChatDelete(chat, folderId, chatNode);
    close();
  });

  container.appendChild(deleteButton);

  return container;
}

async function handleDeleteFolder(id) {
  const { folders = [] } = await chrome.storage.local.get("folders");

  chrome.storage.local.set({
    folders: folders.filter((f) => f.id !== id),
  });
  chrome.storage.local.remove([id]);

  updateFolders();
}

async function handleEditFolderName(folderNameNode, editButton, optionsButton) {
  optionsButton.disabled = true;
  const { folders = [] } = await chrome.storage.local.get("folders");
  const oldName = folderNameNode.innerText;

  const input = document.createElement("input");
  input.classList.add("styled-inline-input");
  input.value = oldName;

  const saveButton = document.createElement("button");
  saveButton.classList.add("inline-text-button");
  saveButton.textContent = "Save";

  editButton.disabled = true;

  folderNameNode.innerText = null;
  folderNameNode.appendChild(input);
  folderNameNode.appendChild(saveButton);

  saveButton.addEventListener("click", () => {
    folderNameNode.removeChild(folderNameNode.firstChild);
    folderNameNode.removeChild(folderNameNode.firstChild);
    editButton.disabled = false;
    const newName = input.value;
    folderNameNode.innerText = newName;

    chrome.storage.local.set({
      folders: folders.map((f) =>
        f.name === oldName ? { ...f, name: newName } : f
      ),
    });

    optionsButton.disabled = false;
  });
}

async function toggleFolder(folder, toggleOpenButton, folderHeader, chatsNode) {
  const { folders = [] } = await chrome.storage.local.get("folders");

  folder.open = !folder.open;
  chatsNode.hidden = !chatsNode.hidden;
  if (folder.open) {
    toggleOpenButton.classList.add("toggle-open-button-rotated");
    folderHeader.classList.add("folder-header-open");
  } else {
    toggleOpenButton.classList.remove("toggle-open-button-rotated");
    folderHeader.classList.remove("folder-header-open");
  }

  chrome.storage.local.set({
    folders: folders.map((f) =>
      f.id === folder.id ? { ...f, open: folder.open } : f
    ),
  });
}

async function handleChatDelete(chat, folderId, chatNode) {
  const { [folderId]: targetFolder = [] } = await chrome.storage.local.get([
    folderId,
  ]);

  await chrome.storage.local.set({
    [folderId]: targetFolder.filter((x) => x.href !== chat.href),
  });

  chatNode.parentNode.removeChild(chatNode);
}

let isDropping = false;
async function handleDrop(e, destinationFolderId, destinationChat) {
  if (isDropping) return;
  isDropping = true;
  e.preventDefault();
  console.log("destCHat:", destinationChat);

  const sourceFolderId = e.dataTransfer.getData("sourceFolderId");
  const draggedChatName = e.dataTransfer.getData("chatName");
  const draggedChatHref = e.dataTransfer.getData("chatHref");
  const draggedChat = {
    href: draggedChatHref,
    name: draggedChatName,
  };

  // if chat was dropped within its folder (replaced)
  if (sourceFolderId === destinationFolderId) {
    await handleDropSameFolder(sourceFolderId, draggedChat, destinationChat);
  } else {
    const { [destinationFolderId]: destinationFolder = [] } =
      await chrome.storage.local.get([destinationFolderId]);

    const { [sourceFolderId]: sourceFolder = [] } =
      await chrome.storage.local.get([sourceFolderId]);

    let pushIndex = destinationFolder.length;
    for (let i = 0; i < destinationFolder.length; i++) {
      // if chat was dragged onto another chat we want to place it before
      if (destinationFolder[i].href === destinationChat?.href) {
        pushIndex = i;
        console.log("pushed on:", i);
      }
      //duplicate
      if (destinationFolder[i].href === draggedChatHref) return;
    }

    chrome.storage.local.set({
      [sourceFolderId]: sourceFolder.filter((x) => x.href !== draggedChatHref),
    });

    destinationFolder.splice(pushIndex, 0, draggedChat);
    console.log(destinationFolder);

    await chrome.storage.local.set({
      [destinationFolderId]: destinationFolder,
    });
  }
  updateFolders();
  e.target.classList.remove("dragover");
  isDropping = false;
}

async function handleDropSameFolder(folderId, draggedChat, destinationChat) {
  let { [folderId]: folder = [] } = await chrome.storage.local.get([folderId]);

  let pushIndex = folder.length;
  for (let i = 0; i < folder.length; i++) {
    // if chat was dragged onto another chat we want to place it before
    // if chat was dragged on a folder (we don't have destinationChat)
    // pushIndex remains as the last index
    if (folder[i].href === destinationChat?.href) pushIndex = i;
  }

  folder = folder.filter((x) => x.href !== draggedChat.href);
  folder.splice(pushIndex, 0, draggedChat);

  chrome.storage.local.set({
    [folderId]: folder,
  });
}

function handleDrag(e, chat, folder) {
  e.dataTransfer.setData("chatName", chat.name);
  e.dataTransfer.setData("chatHref", chat.href);
  e.dataTransfer.setData("sourceFolderId", folder.id);
}

async function getFolders() {
  let { folders = [] } = await chrome.storage.local.get("folders");

  const foldersContainer = document.createElement("div");
  foldersContainer.classList.add("folders-container");

  const foldersLabel = document.createElement("p");
  foldersLabel.classList.add("folders-label");
  foldersLabel.textContent = "Folders";

  const createFolderButton = document.createElement("button");
  createFolderButton.classList.add("styled-button");
  createFolderButton.innerText = "Add new folder";
  createFolderButton.addEventListener("click", (e) =>
    attachPopup((close) => createFolderMenu(close), e)
  );

  const foldersNode = document.createElement("ul");
  foldersNode.classList.add("folders");

  folders.forEach(async (folder) => {
    const chatsNode = document.createElement("ul");
    const folderNode = createFolderNode(folder, chatsNode, folders);
    chatsNode.hidden = !folder.open;

    const { [folder.id]: chats = [] } = await chrome.storage.local.get([
      folder.id,
    ]);
    chats.forEach((chat) => {
      const chatNode = createChatNode(chat, folder);
      chatsNode.appendChild(chatNode);
    });

    folderNode.appendChild(chatsNode);
    foldersNode.appendChild(folderNode);
  });

  foldersContainer.appendChild(foldersLabel);
  foldersContainer.appendChild(foldersNode);
  foldersContainer.appendChild(createFolderButton);
  return foldersContainer;
}

async function updateFolders() {
  const target = document.querySelector(".folders-container");

  const folders = await getFolders();
  target.replaceWith(folders);
}

function getContrastColor(color) {
  color = color.replace("#", "");

  // Convert hex to RGB values
  let r = parseInt(color.substring(0, 2), 16);
  let g = parseInt(color.substring(2, 4), 16);
  let b = parseInt(color.substring(4, 6), 16);

  // Calculate the luminance (brightness)
  let luminance = 0.299 * r + 0.587 * g + 0.114 * b;

  // Return black for light colors, white for dark colors
  return luminance > 128 ? "#000000" : "#ffffff";
}
