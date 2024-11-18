// variables that allow to drag chats from folder to folder
let draggedChat;
let sourceFolderName;

// getting folders from chrome.storage
function getFolders() {
  const folderList = document.createElement("ul");
  folderList.className = "custom-folders";
  folderList.style.margin = "1rem";

  chrome.storage.local.get("folders").then((result) => {
    const folders = result.folders || [];
    folders.forEach((f) => {
      const folder = document.createElement("li");
      const folderName = document.createElement("div");
      folderName.innerText = f.name;
      folderName.style.backgroundColor = f.color;
      const chatList = document.createElement("ul");
      chatList.hidden = !f.open;

      // toggle open/close folder
      const toggleOpen = document.createElement("button");
      toggleOpen.innerText = ">";
      toggleOpen.addEventListener("click", () => {
        chatList.hidden = !chatList.hidden;

        // tried persisting opening of folders but encounter an error when
        // prevoiusly toggled folder (only one) is also toggled
        // chrome.storage.local
        //   .set({
        //     folders: folders.map((x) =>
        //       x.name === folder.firstChild.innerText
        //         ? { ...x, open: !x.open }
        //         : x
        //     ),
        //   })
        //   .then(console.log(f.name));

        if (toggleOpen.innerText === ">") toggleOpen.innerText = "<";
        else toggleOpen.innerText = ">";
      });

      // drop functionality begin
      folder.addEventListener(
        "dragover",
        (e) => {
          e.preventDefault();
        },
        false
      );
      folder.addEventListener("drop", (e) => {
        e.preventDefault();

        console.log(draggedChat);
        console.log(sourceFolderName);
        const destinationFolderName = folder.firstChild.firstChild.textContent;
        console.log(destinationFolderName);

        //adding to destination folder
        chrome.storage.local.get([destinationFolderName]).then((result) => {
          const destinationFolder = result[destinationFolderName] || [];

          for (let i = 0; i < destinationFolder.length; i++) {
            if (destinationFolder[i].href === draggedChat.firstChild.href)
              return;
          }

          chrome.storage.local.set({
            [destinationFolderName]: [
              ...destinationFolder,
              {
                name: draggedChat.firstChild.innerText,
                href: draggedChat.firstChild.href,
              },
            ],
          });

          //removing from source folder
          // scoped because of "return" when "new" folder already has the chat
          chrome.storage.local.get([sourceFolderName]).then((result) => {
            const sourceFolder = result[sourceFolderName] || [];

            chrome.storage.local.set({
              [sourceFolderName]: sourceFolder.filter(
                (x) => x.href !== draggedChat.firstChild.href
              ),
            });
          });
          chatList.appendChild(draggedChat);
        });
      });
      // drop functionality end

      chrome.storage.local.get([f.name]).then((result) => {
        const chats = result[f.name] || [];
        chats.forEach((c) => {
          const chat = document.createElement("li");
          const link = document.createElement("a");
          const deleteButton = document.createElement("button");
          deleteButton.textContent = "-";

          link.href = c.href;
          link.innerText = c.name;
          link.target = "_self";

          chat.style.marginLeft = "1rem";
          chat.style.border = "1px solid black";
          chat.draggable = true;
          chat.style.userSelect = "none";

          // dragging chat from one folder to another
          chat.addEventListener("dragstart", (e) => {
            draggedChat = e.target.parentNode;
            sourceFolderName =
              e.target.parentNode.parentNode.parentNode.firstChild.firstChild
                .textContent;
          });

          deleteButton.addEventListener("click", (e) => {
            targetChat = e.target.parentNode;
            targetFolderName =
              e.target.parentNode.parentNode.parentNode.firstChild.firstChild
                .textContent;
            chrome.storage.local.get([targetFolderName]).then((result) => {
              const targetFolder = result[targetFolderName] || [];

              chrome.storage.local.set({
                [targetFolderName]: targetFolder.filter(
                  (x) => x.href !== targetChat.firstChild.href
                ),
              });

              updateFolders();
            });
          });

          chat.appendChild(link);
          chat.appendChild(deleteButton);
          chatList.appendChild(chat);
        });
      });
      folderName.appendChild(toggleOpen);
      folder.appendChild(folderName);
      folder.appendChild(chatList);
      folderList.appendChild(folder);
    });
  });

  return folderList;
}

// update folder menu
function updateFolders() {
  const target = document.querySelector(".custom-folders");
  console.log("updated folders");

  const folders = getFolders();

  target.replaceWith(folders);
}
