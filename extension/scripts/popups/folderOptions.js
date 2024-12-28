function createFolderOptions(folder, folderNameNode, optionsButton, close) {
  const container = document.createElement("div");
  container.classList.add("options-container");

  const editNameButton = document.createElement("button");
  editNameButton.classList.add("styled-button");
  editNameButton.innerText = "Name";
  editNameButton.addEventListener("click", () => {
    handleEditFolderName(folder, optionsButton, folderNameNode);
    close();
  });

  const editColorButton = document.createElement("button");
  editColorButton.classList.add("styled-button");
  editColorButton.innerText = "Color";
  editColorButton.addEventListener("click", () => {
    handleEditFolderColor(folder, optionsButton, folderNameNode);
    close();
  });

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("styled-button");
  deleteButton.innerText = "Delete";
  deleteButton.addEventListener("click", () => {
    handleDeleteFolder(folder._id);
    close();
  });

  container.appendChild(editNameButton);
  container.appendChild(editColorButton);
  container.appendChild(deleteButton);

  return container;
}

async function handleDeleteFolder(id) {
  await api.deleteFolder(id);

  await updateFoldersNode();
}

async function handleEditFolderColor(folder, optionsButton, folderNameNode) {
  optionsButton.disabled = true;

  const input = document.createElement("input");
  input.type = "color";
  input.value = folder.color;

  const saveButton = document.createElement("button");
  saveButton.classList.add("inline-colored-text-button");
  saveButton.textContent = "Save";

  folderNameNode.innerText = null;
  folderNameNode.appendChild(input);
  folderNameNode.appendChild(saveButton);

  saveButton.addEventListener("click", async () => {
    await api.updateFolder(folder._id, { color: input.value });

    await updateFoldersNode();
  });
}

async function handleEditFolderName(folder, optionsButton, folderNameNode) {
  optionsButton.disabled = true;

  const input = document.createElement("input");
  input.classList.add("styled-inline-input");
  input.value = folder.name;

  const saveButton = document.createElement("button");
  saveButton.classList.add("inline-colored-text-button");
  saveButton.textContent = "Save";

  folderNameNode.innerText = null;
  folderNameNode.appendChild(input);
  folderNameNode.appendChild(saveButton);

  saveButton.addEventListener("click", async () => {
    await api.updateFolder(folder._id, { name: input.value });

    await updateFoldersNode();
  });
}
