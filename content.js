// open folder creation / chat adding menu
function openMenu(name, href) {
  // Show the menu
  const menu = document.getElementById("hidden-menu");
  menu.style.display = "block";

  const selected = document.getElementById("selected");
  selected.textContent = "SELECT A FOLDER";
  const folders = document.getElementById("folders");
  const folderName = document.getElementById("foldername");
  const folderColor = document.getElementById("foldercolor");
  const addFolder = document.getElementById("addfolder");
  const addToFolder = document.getElementById("addtofolder");
  const helperText = document.getElementById("helpertext");

  let selectedFolder = null;

  // set selected folder based on click and set border around it
  // button ADD is not active until folder is selected
  // pressing enter with text input in field creates a folder

  //get folders from storage
  chrome.storage.local.get("folders").then((result) => {
    const foldersList = result.folders || [];
    foldersList.forEach((item) => {
      const div = document.createElement("div");
      div.innerText = item.name;
      div.style.backgroundColor = item.color;

      div.addEventListener("click", () => {
        selectedFolder = div.innerText;
        selected.textContent = selectedFolder;
      });

      folders.appendChild(div);
    });
  });

  // add new folder
  const addfld = async () => {
    const newName = folderName.value;
    const newColor = folderColor.value;
    chrome.storage.local.get("folders").then((result) => {
      const folderList = result.folders || [];

      helperText.style.display = "none";
      // go through all folder names to find duplicate
      for (let i = 0; i < folderList.length; i++) {
        if (folderList[i].name === newName) {
          helperText.style.display = "block";
          return;
        }
      }

      const div = document.createElement("div");
      div.textContent = newName;

      div.addEventListener("click", () => {
        selectedFolder = div.innerText;
        selected.innerText = selectedFolder;
      });

      selectedFolder = div.innerText;
      selected.innerText = selectedFolder;
      folders.appendChild(div);

      chrome.storage.local.set({
        folders: [...folderList, { name: newName, color: newColor }],
      });
    });
  };
  addFolder.addEventListener("click", addfld, true);

  // add to folder
  const add = () => {
    console.log(selectedFolder);
    console.log(name);
    if (!selectedFolder) return;
    chrome.storage.local.get(selectedFolder).then((result) => {
      const folder = result[selectedFolder] || [];

      chrome.storage.local.set({
        [selectedFolder]: [...folder, { name, href }],
      });
    });

    addToFolder.removeEventListener("click", add, true);
    addFolder.removeEventListener("click", addfld, true);
    folders.innerHTML = "";
    menu.style.display = "none";
    updateFolders();
  };
  addToFolder.addEventListener("click", add, true);
}

// Observe changes in the DOM using MutationObserver
const observer = new MutationObserver(() => {
  appendMenu();
  appendFolders();
  appendButtonsToLinks(); // Call the function on every mutation
});
// Start observing the document body for changes
observer.observe(document.body, {
  childList: true, // Watch for added/removed elements
  subtree: true, // Include all descendants
});
