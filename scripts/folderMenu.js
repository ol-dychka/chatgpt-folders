function attachFolderMenu() {
  if (!document.querySelector(".custom-folder-menu")) {
    const folderMenu = createFolderMenu();
    document.body.appendChild(folderMenu);
  }
}

function createFolderMenu() {
  const folderMenuContainer = document.createElement("div");
  folderMenuContainer.classList.add("folder-menu-container");
  folderMenuContainer.classList.add("custom-folder-menu");

  const controls = document.createElement("div");
  controls.classList.add("flex-between");

  const label = document.createElement("p");
  label.classList.add("folder-menu-label");
  label.textContent = "Create a New Folder";

  const closeButton = document.createElement("button");
  closeButton.classList.add("styled-button");
  closeButton.textContent = "×";

  closeButton.addEventListener("click", () => handleCloseFolderMenu());

  controls.appendChild(label);
  controls.appendChild(closeButton);

  const inputs = document.createElement("div");
  inputs.classList.add("flex-between", "folder-menu-inputs");

  const nameInput = document.createElement("input");
  nameInput.classList.add("styled-input");

  const colorInput = document.createElement("input");
  colorInput.type = "color";
  colorInput.value = generateHexCode();

  inputs.appendChild(nameInput);
  inputs.appendChild(colorInput);

  const addFolderButton = document.createElement("button");
  addFolderButton.classList.add("styled-button");
  addFolderButton.textContent = "Add Folder";

  addFolderButton.addEventListener("click", () =>
    handleAddFolder(nameInput.value, colorInput.value)
  );

  folderMenuContainer.appendChild(controls);
  folderMenuContainer.appendChild(inputs);
  folderMenuContainer.appendChild(addFolderButton);

  return folderMenuContainer;
}

async function handleAddFolder(name, color) {
  if (/\S/.test(name)) {
    // string is not empty and not just whitespace
    const { folders = [] } = await chrome.storage.local.get("folders");
    if (folders.some((folder) => folder.name === name)) return;

    chrome.storage.local.set({
      folders: [...folders, { name, color, open: true }],
    });
    handleCloseFolderMenu();
    updateFolders();
  }
}

function handleCloseFolderMenu() {
  const folderMenu = document.querySelector(".custom-folder-menu");
  if (folderMenu) {
    document.body.removeChild(folderMenu);
  }
}

function generateHexCode() {
  const res =
    "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");
  console.log(res);
  return res;
}
