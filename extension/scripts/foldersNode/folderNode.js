// creates a folder element that can be interacted with (drag-and-drop, toggle open)
// params:
// folder - provides information about folder (name, color, state)
// conversationsNode - conversations element that is placed inside a folder
// and can be toggled open or closed

function createFolderNode(folder, conversationsNode) {
  const folderNode = document.createElement("li");
  folderNode.style.position = "relative";

  const folderHeader = document.createElement("div");
  folderHeader.classList.add("folder-header");
  folderHeader.style.backgroundColor = folder.color;
  folderHeader.style.color = getContrastColor(folder.color);

  const folderName = document.createElement("div");
  folderName.classList.add("folder-name");
  folderName.innerText = folder.name;

  const optionsButton = document.createElement("button");
  optionsButton.classList.add("inline-colored-text-button");
  optionsButton.innerText = "•••";
  optionsButton.addEventListener("click", (e) =>
    attachPopup(
      (close) => createFolderOptions(folder, folderName, optionsButton, close),
      e
    )
  );

  const toggleButton = document.createElement("button");
  toggleButton.classList.add("toggle-open-button", "inline-colored-button");
  toggleButton.innerText = "›";
  if (folder.isOpen) toggleButton.classList.add("toggle-open-button-rotated");
  toggleButton.addEventListener("click", () =>
    toggleFolder(folder, toggleButton, folderHeader, conversationsNode)
  );

  //check if folder is open
  if (folder.isOpen) {
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
    handleDragFolder(e, folder);
  });

  folderHeader.addEventListener("dragover", (e) => e.preventDefault(), false);
  folderHeader.addEventListener(
    "drop",
    (e) => handleDropConversation(e, folder._id),
    false
  );

  folderNode.appendChild(folderHeader);
  folderNode.appendChild(conversationsNode);
  const dropzone = createDropzone((e) => handleDropFolder(e, folder._id));
  folderNode.appendChild(dropzone);

  return folderNode;
}

// toggles folder open or closed, makes a call to backend every time
// params:
// folder - used for checking it's state
// toggleOpenButton, folderHeader - applying CSS classes which show that folder is open,
// purely cosmetic
// conversationsNode - switches between hidden and not hidden states

async function toggleFolder(
  folder,
  toggleOpenButton,
  folderHeader,
  conversationsNode
) {
  folder.isOpen = !folder.isOpen;
  conversationsNode.hidden = !conversationsNode.hidden;
  if (folder.isOpen) {
    toggleOpenButton.classList.add("toggle-open-button-rotated");
    folderHeader.classList.add("folder-header-open");
  } else {
    toggleOpenButton.classList.remove("toggle-open-button-rotated");
    folderHeader.classList.remove("folder-header-open");
  }

  await api.updateFolder(folder._id, { isOpen: folder.isOpen });
}

// helper function that gets contrasting text color to that of a folder

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
