// Function to append the button to links
function appendButtonToLinks() {
  const links = document.querySelectorAll("li > div > a"); // Select all link elements
  console.log("btn");

  links.forEach((link) => {
    // Check if button is already appended to avoid infinite loop
    if (!link.querySelector(".custom-button")) {
      const button = document.createElement("button");
      button.innerText = "+";
      button.style.marginRight = "2rem";
      button.className = "custom-button"; // Add class to identify appended buttons

      button.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("clicked");
        openMenu(link.firstChild.innerText, link.href);
      });

      link.appendChild(button);
    }
  });
}

function appendMenu() {
  if (!document.body.querySelector(".custom-menu")) {
    const menu = document.createElement("div");
    menu.className = "custom-menu";

    menu.id = "hidden-menu";
    menu.style.display = "none"; // Initially hidden
    menu.style.position = "fixed";
    menu.style.top = "50%";
    menu.style.left = "50%";
    menu.style.transform = "translate(-50%, -50%)";
    menu.style.padding = "20px";
    menu.style.backgroundColor = "#f0f0f0";
    menu.style.border = "1px solid black";

    const selected = document.createElement("p");
    selected.id = "selected";
    selected.style.color = "red";

    const folders = document.createElement("div");
    folders.id = "folders";
    folders.style.display = "flex";
    folders.style.gap = "1rem";

    const folderName = document.createElement("input");
    folderName.id = "foldername";
    folderName.type = "text";

    const addFolder = document.createElement("button");
    addFolder.id = "addfolder";
    addFolder.innerText = "Add Folder";

    const addToFolder = document.createElement("button");
    addToFolder.id = "addtofolder";
    addToFolder.innerText = "Add";

    const helperText = document.createElement("div");
    helperText.id = "helpertext";
    helperText.style.display = "none";
    helperText.innerText = "Folder with this name already exists";

    menu.appendChild(selected);
    menu.appendChild(folders);
    menu.appendChild(folderName);
    menu.appendChild(addFolder);
    menu.appendChild(addToFolder);
    menu.appendChild(helperText);

    document.body.appendChild(menu);
  }
}

// open menu
function openMenu(name, href) {
  // Show the menu
  const menu = document.getElementById("hidden-menu");
  menu.style.display = "block";

  const selected = document.getElementById("selected");
  selected.textContent = "SELECT A FOLDER";
  const folders = document.getElementById("folders");
  const folderName = document.getElementById("foldername");
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
      div.innerText = item;

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
    chrome.storage.local.get("folders").then((result) => {
      const folderList = result.folders || [];

      if (folderList.includes(newName)) {
        helperText.style.display = "block";
      } else {
        helperText.style.display = "none";

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
          folders: [...folderList, newName],
        });
      }
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

// drag from folder to folder
let dragged;
let draggedFrom;

function appendFolders() {
  const nav = document.querySelector("nav");
  const target = nav.getElementsByTagName("div")[2];
  console.log("fld");

  if (!target.querySelector(".custom-folders")) {
    const itemList = document.createElement("ul");
    itemList.className = "custom-folders";

    chrome.storage.local.get("folders").then((result) => {
      const folders = result.folders || [];
      folders.forEach((folder) => {
        const li = document.createElement("li");
        li.innerText = folder;
        const ul = document.createElement("ul");

        li.addEventListener(
          "dragover",
          (e) => {
            e.preventDefault();
          },
          false
        );
        li.addEventListener("drop", (e) => {
          e.preventDefault();
          ul.appendChild(dragged);

          console.log(dragged);
          console.log(draggedFrom);
          console.log(li.innerText);

          //removing from old folder
          chrome.storage.local.get([draggedFrom]).then((result) => {
            const folder = result[draggedFrom] || [];

            chrome.storage.local.set({
              [draggedFrom]: folder.filter(
                (x) => x.href !== dragged.firstChild.href
              ),
            });
          });

          const newFolderName = li.firstChild.textContent;
          //adding to new folder
          chrome.storage.local.get([newFolderName]).then((result) => {
            const folder = result[newFolderName] || [];

            chrome.storage.local.set({
              [newFolderName]: [
                ...folder,
                {
                  name: dragged.firstChild.innerText,
                  href: dragged.firstChild.href,
                },
              ],
            });
          });
        });

        chrome.storage.local.get([folder]).then((result) => {
          const items = result[folder] || [];
          items.forEach((item) => {
            const li1 = document.createElement("li");
            const a = document.createElement("a");

            a.href = item.href;
            a.innerText = item.name;
            a.target = "_self";

            li1.style.marginLeft = "1rem";
            li1.style.border = "1px solid black";
            li1.draggable = true;
            li1.style.userSelect = "none";

            // dragging
            li1.addEventListener("dragstart", (e) => {
              dragged = e.target.parentNode;
              draggedFrom =
                e.target.parentNode.parentNode.parentNode.firstChild
                  .textContent;
            });

            li1.appendChild(a);
            ul.appendChild(li1);
          });
        });
        li.appendChild(ul);
        itemList.appendChild(li);
      });
    });

    target.insertBefore(itemList, target.firstChild);
  }
}

function updateFolders() {
  const target = document.querySelector(".custom-folders");

  const itemList = document.createElement("ul");
  itemList.className = "custom-folders";

  chrome.storage.local.get("folders").then((result) => {
    const folders = result.folders || [];
    folders.forEach((folder) => {
      const li = document.createElement("li");
      li.innerText = folder;
      const ul = document.createElement("ul");

      chrome.storage.local.get([folder]).then((result) => {
        const items = result[folder] || [];
        items.forEach((item) => {
          const li = document.createElement("li");
          const a = document.createElement("a");

          a.href = item.href;
          a.innerText = item.name;
          a.target = "_self";

          li.style.marginLeft = "1rem";

          li.appendChild(a);
          ul.appendChild(li);
        });
      });
      li.appendChild(ul);
      itemList.appendChild(li);
    });
  });

  target.replaceWith(itemList);
}

// Observe changes in the DOM using MutationObserver
const observer = new MutationObserver(() => {
  appendMenu();
  appendFolders();
  appendButtonToLinks(); // Call the function on every mutation
});
// Start observing the document body for changes
observer.observe(document.body, {
  childList: true, // Watch for added/removed elements
  subtree: true, // Include all descendants
});

// Initial call to append buttons and menu when the script first runs
// appendButtonToLinks();
// appendFolders();
// appendMenu();
