function createFolderNode(folder, folderIndex, chatsNode) {
  const folderNode = document.createElement("li");
  folderNode.style.position = "relative";

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

  folderHeader.draggable = true;
  folderHeader.addEventListener("dragstart", (e) => {
    handleDragFolder(e, folder.id);
  });

  folderHeader.addEventListener("dragover", (e) => e.preventDefault(), false);
  folderHeader.addEventListener(
    "drop",
    (e) => handleDropToFolder(e, folder.id),
    false
  );

  if (folderIndex === 0) {
    const firstDropzone = createDropzone(
      true,
      (e) => handleDropFolder(e),
      true
    );
    folderNode.appendChild(firstDropzone);
  }
  folderNode.appendChild(folderHeader);
  const dropzone = createDropzone(
    false,
    (e) => handleDropFolder(e, folder.id),
    true
  );
  folderNode.appendChild(dropzone);

  return folderNode;
}

function createChatNode(chat, chatIndex, folder) {
  const chatNode = document.createElement("li");
  chatNode.style.position = "relative";

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
  chatText.addEventListener("dragstart", (e) =>
    handleDragChat(e, chat, folder)
  );

  chatHeader.appendChild(chatText);

  if (chatIndex === 0) {
    const firstDropzone = createDropzone(true, (e) =>
      handleDropToFolder(e, folder.id)
    );
    chatNode.appendChild(firstDropzone);
  }
  chatNode.appendChild(chatHeader);
  const dropzone = createDropzone(false, (e) =>
    handleDropToFolder(e, folder.id, chat)
  );
  chatNode.appendChild(dropzone);

  return chatNode;
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

  folders.forEach(async (folder, folderIndex) => {
    const chatsNode = document.createElement("ul");
    const folderNode = createFolderNode(
      folder,
      folderIndex,
      chatsNode,
      folders
    );
    chatsNode.hidden = !folder.open;

    const { [folder.id]: chats = [] } = await chrome.storage.local.get([
      folder.id,
    ]);
    chats.forEach((chat, chatIndex) => {
      const chatNode = createChatNode(chat, chatIndex, folder);
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
