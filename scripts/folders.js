function createFolderNode(folder, chatsNode) {
  const folderNode = document.createElement("li");

  const folderHeader = document.createElement("div");
  folderHeader.classList.add("folder-header");
  // folderHeader.style.backgroundColor = folder.color;
  // folderHeader.style.color = getContrastColor(folder.color);

  const gap = document.createElement("div");
  gap.classList.add("chat-gap");

  gap.addEventListener("dragover", (e) => e.preventDefault(), false);
  gap.addEventListener(
    "drop",
    async (e) => handleDropFolder(e, folder.id),
    false
  );
  gap.addEventListener("dragenter", (e) => e.target.classList.add("dragover"));
  gap.addEventListener("dragleave", (e) =>
    e.target.classList.remove("dragover")
  );

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
    (e) => handleDropChat(e, folder.id),
    false
  );

  folderNode.appendChild(gap);
  folderNode.appendChild(folderHeader);

  return folderNode;
}

function createChatNode(chat, folder) {
  const chatNode = document.createElement("li");
  const chatHeader = document.createElement("div");
  chatHeader.classList.add("chat-header");
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

  const gap = document.createElement("div");
  gap.classList.add("chat-gap");

  gap.addEventListener("dragover", (e) => e.preventDefault(), false);
  gap.addEventListener(
    "drop",
    async (e) => handleDropChat(e, folder.id, chat),
    false
  );
  gap.addEventListener("dragenter", (e) => e.target.classList.add("dragover"));
  gap.addEventListener("dragleave", (e) =>
    e.target.classList.remove("dragover")
  );

  chatHeader.appendChild(gap);
  chatHeader.appendChild(chatText);
  chatNode.appendChild(chatHeader);

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

    const lastChatGap = document.createElement("div");
    lastChatGap.classList.add("chat-gap-li");

    lastChatGap.addEventListener("dragover", (e) => e.preventDefault(), false);
    lastChatGap.addEventListener(
      "drop",
      async (e) => handleDropChat(e, folder.id),
      false
    );
    lastChatGap.addEventListener("dragenter", (e) =>
      e.target.classList.add("dragover")
    );
    lastChatGap.addEventListener("dragleave", (e) =>
      e.target.classList.remove("dragover")
    );

    chatsNode.appendChild(lastChatGap);

    folderNode.appendChild(chatsNode);
    foldersNode.appendChild(folderNode);
  });

  const lastFolderGap = document.createElement("div");
  lastFolderGap.classList.add("chat-gap");

  lastFolderGap.addEventListener("dragover", (e) => e.preventDefault(), false);
  lastFolderGap.addEventListener(
    "drop",
    async (e) => handleDropFolder(e),
    false
  );
  lastFolderGap.addEventListener("dragenter", (e) =>
    e.target.classList.add("dragover")
  );
  lastFolderGap.addEventListener("dragleave", (e) =>
    e.target.classList.remove("dragover")
  );

  foldersNode.appendChild(lastFolderGap);

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
