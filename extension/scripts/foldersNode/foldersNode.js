async function createFoldersNode() {
  folders = await api.getFolders();

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
    let conversationsNode = document.createElement("ul");
    conversationsNode.hidden = !folder.isOpen;

    if (folder.conversations && folder.conversations.length > 0) {
      folder.conversations.forEach((conversation) => {
        const conversationNode = createConversationNode(conversation, folder);
        conversationsNode.appendChild(conversationNode);
      });
    }

    const folderNode = createFolderNode(folder, conversationsNode);
    foldersNode.appendChild(folderNode);
  });

  foldersContainer.appendChild(foldersLabel);
  foldersContainer.appendChild(foldersNode);
  foldersContainer.appendChild(createFolderButton);

  return foldersContainer;
}

async function updateFoldersNode() {
  const target = document.querySelector(".folders-container");

  const folders = await createFoldersNode();
  target.replaceWith(folders);
}
