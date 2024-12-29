// this function creates a menu where user can add conversation to multiple folders at once.
// Function makes a call to backend to get all folders and generates a list with checkboxes.
// There's an array of selected folders and 2 methods to interact with it: add and delete,
// that are both implemented through checkboxes.
//
// params:
// name - name of a ChatGPT conversation
// href - link that you get redirected to if you click on conversation
// close - method that closes the menu
//
// returns: menu element

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

  const conversationMenuContainer = document.createElement("div");
  conversationMenuContainer.classList.add("conversation-menu-container");

  const controls = document.createElement("div");
  controls.classList.add("flex-between");

  const label = document.createElement("p");
  label.classList.add("conversation-menu-label");
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

  conversationMenuContainer.appendChild(controls);
  conversationMenuContainer.appendChild(folderListNode);
  conversationMenuContainer.appendChild(addConversationButton);
  return conversationMenuContainer;
}

// this function creates a list of folders with checkmarks
// params:
// folders - all folders
// addToSelected, removeFromSelected - methods to interacts with
// selected folders array in "parent" function
// returns: folder list element
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
    label.classList.add("conversation-menu-label");
    label.textContent = folder.name;

    folderSelectHeader.appendChild(checkbox);
    folderSelectHeader.appendChild(label);

    container.appendChild(folderSelectHeader);
  });
  return container;
}

// this function makes a call to backend when user clicks "Add" button
// params:
// name
// conversationId - got from href
// selectedFolders - list of folders function iterates through (if folder
// already has conversation with the same Id, it's gettign skipped)
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

// helper function to get conversation Id from href
function getIdFromHref(href) {
  return href.split("/")[4];
}
