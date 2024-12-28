// append folder menu to the nav bar
// async functions have problems with rapid mutations so flag is used here
let isRunning = false;
async function appendFoldersNode() {
  if (isRunning) return;
  console.log("fld running");

  try {
    isRunning = true;
    const nav = document.querySelector("nav");
    const target = nav.getElementsByTagName("div")[2];

    if (!target.querySelector(".folders")) {
      const foldersNode = await createFoldersNode();
      console.log(foldersNode);
      target.insertBefore(foldersNode, target.firstChild);
    }
  } catch (err) {
    console.log(err);
  } finally {
    isRunning = false;
  }
}
