// isConversationDropping - a flag that determines if there's
// a call to backend in progress not to make multiple calls and prevent overload.
//
// handleDropConversation - a function that gets all the required
// information from events and handles call to backend.
// It checks for a flag and for type of element that's being transported through event.
//
// params:
// e - drop event
// destinationFolderId - id of a folder where conversation was dropped
// destinationConversationId (optional) - id of a conversation in which respective dropzone
// dragged conversation was dropped. If there is no such "destination" conversation,
// dragged conversation is added to the end of the folder

let isConversationDropping = false;

async function handleDropConversation(
  e,
  destinationFolderId,
  destinationConversationId
) {
  e.preventDefault();
  const type = e.dataTransfer.getData("type");
  if (type === "conversation") {
    if (isConversationDropping) return;
    isConversationDropping = true;

    const sourceFolderId = e.dataTransfer.getData("sourceFolderId");
    const draggedConversationId = e.dataTransfer.getData("conversationId");

    await api.moveConversation(
      draggedConversationId,
      sourceFolderId,
      destinationFolderId,
      destinationConversationId
    );

    isConversationDropping = false;
    await updateFoldersNode();
  }
}
