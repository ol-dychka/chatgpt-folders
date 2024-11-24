// append "+" buttons to links
function appendButtonsToLinks() {
  const links = document.querySelectorAll("li > div > a"); // Select all link elements

  links.forEach((link) => {
    // Check if button is already appended to avoid infinite loop
    if (!link.querySelector(".custom-button")) {
      const button = document.createElement("button");
      button.innerText = "+";
      button.classList.add("add-chat-button", "inline-button");
      button.classList.add("custom-button");

      button.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("clicked");
        openMenu(link.firstChild.innerText, link.href);
      });

      link.appendChild(button);
    }
  });
}

// append folder creation / chat adding menu
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
    folderName.style.width = "100%";

    const folderColor = document.createElement("input");
    folderColor.id = "foldercolor";
    folderColor.type = "color";
    folderColor.value = "#22ff33";

    const addFolder = document.createElement("button");
    addFolder.id = "addfolder";
    addFolder.innerText = "Add Folder";
    addFolder.style.width = "100%";

    const addToFolder = document.createElement("button");
    addToFolder.id = "addtofolder";
    addToFolder.innerText = "Add";
    addToFolder.style.width = "100%";

    const helperText = document.createElement("div");
    helperText.id = "helpertext";
    helperText.style.display = "none";
    helperText.innerText = "Folder with this name already exists";

    menu.appendChild(selected);
    menu.appendChild(folders);
    menu.appendChild(folderName);
    menu.appendChild(folderColor);
    menu.appendChild(addFolder);
    menu.appendChild(addToFolder);
    menu.appendChild(helperText);

    document.body.appendChild(menu);
  }
}

// append folder menu to the nav bar
// async functions have problams with rapid mutations so flag is used here
let isRunning = false;
async function appendFolders() {
  if (isRunning) return;
  console.log("fld running");

  try {
    isRunning = true;
    const nav = document.querySelector("nav");
    const target = nav.getElementsByTagName("div")[2];

    if (!target.querySelector(".folders")) {
      const folders = await getFolders();
      console.log(folders);
      target.insertBefore(folders, target.firstChild);
    }
  } catch (err) {
    console.log(err);
  } finally {
    isRunning = false;
  }
}
