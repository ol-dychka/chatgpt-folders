async function createConversationMenu(name, href, close) {
  let selectedFolders = [];

  const addToSelected = (folder) => {
    selectedFolders.push(folder);
  };

  const removeFromSelected = (folder) => {
    selectedFolders = selectedFolders.filter(
      (selectedFolder) => selectedFolder._id !== folder._id
    );
  };

  const chatMenuContainer = document.createElement("div");
  chatMenuContainer.classList.add("chat-menu-container");

  const controls = document.createElement("div");
  controls.classList.add("flex-between");

  const label = document.createElement("p");
  label.classList.add("chat-menu-label");
  label.textContent = `Add conversation "${name}" to a folder`;

  const closeButton = document.createElement("button");
  closeButton.classList.add("styled-button");
  closeButton.textContent = "×";

  closeButton.addEventListener("click", close);

  controls.appendChild(label);
  controls.appendChild(closeButton);

  const folders = await api.getFolders();

  const folderListNode = createFolderList(
    folders,
    addToSelected,
    removeFromSelected
  );

  const addConversationButton = document.createElement("button");
  addConversationButton.classList.add("styled-button");
  addConversationButton.textContent = "Add Conversation";

  addConversationButton.addEventListener("click", () => {
    console.log(selectedFolders);
    handleAddConversation(name, getIdFromHref(href), selectedFolders);
    close();
  });

  chatMenuContainer.appendChild(controls);
  chatMenuContainer.appendChild(folderListNode);
  chatMenuContainer.appendChild(addConversationButton);
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
      if (checkbox.checked) addToSelected(folder);
      else removeFromSelected(folder);
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

function handleAddConversation(name, conversationId, selectedFolders) {
  console.log(selectedFolders);
  if (!selectedFolders) return;
  selectedFolders.forEach(async (folder) => {
    const isInFolder = folder.conversations
      ? folder.conversations.some(
          (conversation) => conversation.conversationId === conversationId
        )
      : false;
    if (isInFolder) return;
    // else
    await api.addConversation({ name, conversationId, folderId: folder._id });
  });
  updateFoldersNode();
}

function getIdFromHref(href) {
  return href.split("/")[4];
}
