// creates a conversation element that can be interacted with (drag-and-drop, click)
// params:
// conversation - provides information for link (href is made from conversationId property)
// folderId - provides information for drag-and-drop functionality

function createConversationNode(conversation, folderId) {
  const conversationNode = document.createElement("li");
  conversationNode.style.position = "relative";

  const conversationHeader = document.createElement("div");

  const conversationText = document.createElement("div");
  conversationText.classList.add("conversation-text");
  conversationText.draggable = true;

  const link = document.createElement("a");
  link.innerText = conversation.name;
  link.href = `https://chatgpt.com/c/${conversation.conversationId}`;
  link.target = "_self";

  const optionsButton = document.createElement("button");
  optionsButton.classList.add("inline-text-button");
  optionsButton.innerText = "•••";
  optionsButton.addEventListener("click", (e) =>
    attachPopup(
      (close) => createConversationOptions(conversation, folderId, close),
      e
    )
  );

  conversationText.appendChild(link);
  conversationText.appendChild(optionsButton);
  conversationText.addEventListener("dragstart", (e) =>
    handleDragConversation(e, conversation.conversationId, folderId)
  );

  conversationHeader.appendChild(conversationText);
  conversationNode.appendChild(conversationHeader);
  const dropzone = createDropzone((e) =>
    handleDropConversation(e, folderId, conversation.conversationId)
  );
  conversationNode.appendChild(dropzone);

  return conversationNode;
}
