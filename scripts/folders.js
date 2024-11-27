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
    attachPopup((close) =>
      createFolderOptions(
        folder,
        folderName,
        e.clientX,
        e.clientY,
        optionsButton,
        close
      )
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
    handleChatDelete(chat, folder.id, chatNode)
  );

  chatNode.appendChild(link);
  chatNode.appendChild(deleteButton);

  chatNode.addEventListener("dragstart", (e) => handleDrag(e, chat, folder));

  return chatNode;
}

function createFolderOptions(
  folder,
  folderNameNode,
  x,
  y,
  optionsButton,
  close
) {
  const container = document.createElement("div");
  container.classList.add("options-container");
  container.style.top = `${y}px`;
  container.style.left = `${x}px`;

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

async function handleDrop(e, destinationFolderId) {
  e.preventDefault();

  const draggedChatName = e.dataTransfer.getData("chatName");
  const draggedChatHref = e.dataTransfer.getData("chatHref");
  const sourceFolderId = e.dataTransfer.getData("sourceFolderId");

  const { [destinationFolderId]: destinationFolder = [] } =
    await chrome.storage.local.get([destinationFolderId]);

  if (destinationFolder.some((chat) => chat.href === draggedChatHref)) return;

  chrome.storage.local.set({
    [destinationFolderId]: [
      ...destinationFolder,
      {
        name: draggedChatName,
        href: draggedChatHref,
      },
    ],
  });

  const { [sourceFolderId]: sourceFolder = [] } =
    await chrome.storage.local.get([sourceFolderId]);

  chrome.storage.local.set({
    [sourceFolderId]: sourceFolder.filter((x) => x.href !== draggedChatHref),
  });

  updateFolders();
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
  createFolderButton.addEventListener("click", () => attachFolderMenu());

  const foldersNode = document.createElement("ul");
  foldersNode.classList.add("folders");

  folders.forEach(async (folder) => {
    const chatsNode = document.createElement("ul");
    const folderNode = createFolderNode(folder, chatsNode, folders);
    chatsNode.hidden = !folder.open;
    console.log(folder.id);

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
