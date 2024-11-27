// accepts a function that creates a node
function attachPopup(createPopup) {
  const popup = createPopup(close);

  // click outside popup
  const outsideClickListener = (e) => {
    if (!popup.contains(e.target)) {
      console.log(e.target);
      document.body.removeChild(popup);
      document.body.removeEventListener("click", outsideClickListener, true);
    }
  };

  function close() {
    document.body.removeChild(popup);
    document.body.removeEventListener("click", outsideClickListener, true);
  }

  document.body.addEventListener("click", outsideClickListener, true);

  document.body.appendChild(popup);
}
