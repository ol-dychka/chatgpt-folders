// append "+" buttons to links
function appendButtonsToLinks() {
  const links = document.querySelectorAll("li > div > a"); // Select all link elements
  // Check if button is already appended to avoid infinite loop
  links.forEach((link) => {
    if (!link.querySelector(".custom-button")) {
      const button = document.createElement("button");
      button.innerText = "+";
      button.classList.add("add-chat-button", "inline-button");
      button.classList.add("custom-button");

      button.addEventListener("click", (e) => {
        e.preventDefault();
        attachPopup(
          (close) =>
            createConversationMenu(link.firstChild.innerText, link.href, close),
          e
        );
      });

      link.appendChild(button);
    }
  });
}
