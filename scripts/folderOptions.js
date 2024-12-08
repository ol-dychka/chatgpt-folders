function createFolderOptions(folder, folderNameNode, optionsButton, close) {
  const container = document.createElement("div");
  container.classList.add("options-container");

  const editButton = document.createElement("button");
  editButton.classList.add("styled-button");
  editButton.innerText = "Edit";
  editButton.addEventListener("click", () => {
    handleEditFolderName(folderNameNode, editButton, optionsButton, folder.id);
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
  let { folders = [] } = await chrome.storage.local.get("folders");

  folders = removeFolderFromFolders(folders, id);
  chrome.storage.local.set({ folders: folders });
  chrome.storage.local.remove([id]);

  updateFolders();
}

async function handleEditFolderName(
  folderNameNode,
  editButton,
  optionsButton,
  folderId
) {
  optionsButton.disabled = true;
  let { folders = [] } = await chrome.storage.local.get("folders");
  let folder = getFolderFromFolders(folders, folderId);

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

    folder.name = newName;
    folders = replaceFolderInFolders(folders, folder.id, folder);
    chrome.storage.local.set({ folders: folders });

    optionsButton.disabled = false;
  });
}
