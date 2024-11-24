async function attachChatMenu(name, href) {
  if (!document.querySelector(".custom-chat-menu")) {
    const chatMenu = await createChatMenu(name, href);
    document.body.appendChild(chatMenu);
  }
}

async function createChatMenu(name, href) {
  let selectedFolders = [];

  const addToSelected = (folderName) => {
    selectedFolders.push(folderName);
  };

  const removeFromSelected = (folderName) => {
    selectedFolders = selectedFolders.filter((folder) => folder !== folderName);
  };

  const chatMenuContainer = document.createElement("div");
  chatMenuContainer.classList.add("chat-menu-container");
  chatMenuContainer.classList.add("custom-chat-menu");

  const controls = document.createElement("div");
  controls.classList.add("flex-between");

  const label = document.createElement("p");
  label.classList.add("chat-menu-label");
  label.textContent = `Add chat "${name}" to a folder`;

  const closeButton = document.createElement("button");
  closeButton.classList.add("styled-button");
  closeButton.textContent = "×";

  closeButton.addEventListener("click", () => handleCloseChatMenu());

  controls.appendChild(label);
  controls.appendChild(closeButton);

  const { folders = [] } = await chrome.storage.local.get("folders");
  const folderListNode = createFolderList(
    folders,
    addToSelected,
    removeFromSelected
  );

  const addChatButton = document.createElement("button");
  addChatButton.classList.add("styled-button");
  addChatButton.textContent = "Add Chat";

  addChatButton.addEventListener("click", () => {
    console.log(selectedFolders);
    handleAddChat(name, href, selectedFolders);
  });

  chatMenuContainer.appendChild(controls);
  chatMenuContainer.appendChild(folderListNode);
  chatMenuContainer.appendChild(addChatButton);
  return chatMenuContainer;
}

function createFolderList(folders, addToSelected, removeFromSelected) {
  const container = document.createElement("div");
  folders.forEach((folder) => {
    const folderSelectHeader = document.createElement("div");
    folderSelectHeader.classList.add("folder-select-header");

    const checkbox = document.createElement("input");
    checkbox.classList.add("styled-checkbox");
    checkbox.type = "checkbox";
    checkbox.addEventListener("click", () => {
      if (checkbox.checked) addToSelected(folder.name);
      else removeFromSelected(folder.name);
    });

    const label = document.createElement("p");
    label.classList.add("chat-menu-label");
    label.textContent = folder.name;

    folderSelectHeader.appendChild(checkbox);
    folderSelectHeader.appendChild(label);

    container.appendChild(folderSelectHeader);
  });
  return container;
}

function handleAddChat(name, href, selectedFolders) {
  if (!selectedFolders) return;
  selectedFolders.forEach(async (folderName) => {
    const { [folderName]: folder = [] } = await chrome.storage.local.get([
      folderName,
    ]);
    if (folder.some((chat) => chat.href === href)) return;
    chrome.storage.local.set({ [folderName]: [...folder, { name, href }] });
  });
  handleCloseChatMenu();
  updateFolders();
}

function handleCloseChatMenu() {
  const chatMenu = document.querySelector(".custom-chat-menu");
  if (chatMenu) {
    document.body.removeChild(chatMenu);
  }
}
