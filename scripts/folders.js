function createFolderNode(folder, chatsNode) {
  const folderNode = document.createElement("li");

  const folderHeader = document.createElement("div");
  folderHeader.classList.add("folder-header");
  folderHeader.style.backgroundColor = folder.color;
  folderHeader.style.color = getContrastColor(folder.color);

  const folderName = document.createElement("div");
  folderName.classList.add("folder-name");
  folderName.innerText = folder.name;

  const toggleOpenButton = document.createElement("button");
  toggleOpenButton.classList.add("toggle-open-button");
  toggleOpenButton.innerText = "›";
  if (folder.open) toggleOpenButton.classList.add("toggle-open-button-rotated");
  toggleOpenButton.addEventListener("click", () =>
    toggleFolder(folder, toggleOpenButton, folderHeader, chatsNode)
  );

  folderHeader.appendChild(toggleOpenButton);
  folderHeader.appendChild(folderName);
  folderNode.appendChild(folderHeader);

  folderNode.addEventListener("dragover", (e) => e.preventDefault(), false);
  folderNode.addEventListener("drop", (e) => handleDrop(e, folder.name), false);

  return folderNode;
}

function createChatNode(chat, folder) {
  const chatNode = document.createElement("li");
  chatNode.classList.add("chat-header");
  chatNode.draggable = true;

  const link = document.createElement("a");
  link.href = chat.href;
  link.innerText = chat.name;
  link.target = "_self";

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("inline-button");
  deleteButton.textContent = "×";
  deleteButton.addEventListener("click", () =>
    handleChatDelete(chat, folder.name, chatNode)
  );

  chatNode.appendChild(link);
  chatNode.appendChild(deleteButton);

  chatNode.addEventListener("dragstart", (e) => handleDrag(e, chat, folder));

  return chatNode;
}

function toggleFolder(folder, toggleOpenButton, folderHeader, chatsNode) {
  folder.open = !folder.open;
  chatsNode.hidden = !chatsNode.hidden;
  if (folder.open) {
    toggleOpenButton.classList.add("toggle-open-button-rotated");
    folderHeader.classList.add("folder-header-open");
  } else {
    toggleOpenButton.classList.remove("toggle-open-button-rotated");
    folderHeader.classList.remove("folder-header-open");
  }
}

async function handleChatDelete(chat, folderName, chatNode) {
  const { [folderName]: targetFolder = [] } = await chrome.storage.local.get([
    folderName,
  ]);

  await chrome.storage.local.set({
    [folderName]: targetFolder.filter((x) => x.href !== chat.href),
  });

  chatNode.parentNode.removeChild(chatNode);
}

async function handleDrop(e, destinationFolderName) {
  e.preventDefault();

  const draggedChatName = e.dataTransfer.getData("chatName");
  const draggedChatHref = e.dataTransfer.getData("chatHref");
  const sourceFolderName = e.dataTransfer.getData("sourceFolderName");

  const { [destinationFolderName]: destinationFolder = [] } =
    await chrome.storage.local.get([destinationFolderName]);

  if (destinationFolder.some((chat) => chat.href === draggedChatHref)) return;

  chrome.storage.local.set({
    [destinationFolderName]: [
      ...destinationFolder,
      {
        name: draggedChatName,
        href: draggedChatHref,
      },
    ],
  });

  const { [sourceFolderName]: sourceFolder = [] } =
    await chrome.storage.local.get([sourceFolderName]);

  chrome.storage.local.set({
    [sourceFolderName]: sourceFolder.filter((x) => x.href !== draggedChatHref),
  });

  updateFolders();
}

function handleDrag(e, chat, folder) {
  e.dataTransfer.setData("chatName", chat.name);
  e.dataTransfer.setData("chatHref", chat.href);
  e.dataTransfer.setData("sourceFolderName", folder.name);
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
  createFolderButton.addEventListener("click", () => attachFolderMenu());

  const foldersNode = document.createElement("ul");
  foldersNode.classList.add("folders");

  folders.forEach(async (folder) => {
    const chatsNode = document.createElement("ul");
    const folderNode = createFolderNode(folder, chatsNode);
    chatsNode.hidden = !folder.open;

    const { [folder.name]: chats = [] } = await chrome.storage.local.get([
      folder.name,
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
