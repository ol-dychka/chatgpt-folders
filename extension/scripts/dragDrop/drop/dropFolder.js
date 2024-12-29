// isFolderDropping - a flag that determines if there's
// a call to backend in progress not to make multiple calls and prevent overload.
//
// handleDropFolder - a function that gets all the required
// information from events and handles call to backend.
// It checks for a flag and for type of element that's being transported through event.
//
// params:
// e - drop event
// destinationFolderId - id of a folder in which respective dropzone
// dragged folder was dropped

let isFolderDropping = false;

async function handleDropFolder(e, destinationFolderId) {
  e.preventDefault();
  const type = e.dataTransfer.getData("type");
  if (type === "folder") {
    if (isFolderDropping) return;
    isFolderDropping = true;

    const draggedFolderId = e.dataTransfer.getData("draggedFolderId");

    await api.moveFolder(draggedFolderId, destinationFolderId);

    isFolderDropping = false;
  }
  await updateFoldersNode();
}
