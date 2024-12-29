// Creates a dropzone (it is attached on top of element when element is created)
// Can be interacted with while dragging to drop element inside of it
// Event listeners track progress of dragging and apply CSS classes that make element visible
//
// params:
// handleDrop - function that determines an action after dropping the element
//
// returns:
// dropzone element

function createDropzone(handleDrop) {
  const dropzone = document.createElement("div");
  dropzone.classList.add("dropzone");

  dropzone.addEventListener(
    "drop",
    (e) => {
      handleDrop(e);
      e.target.classList.remove("dragover");
    },
    false
  );

  dropzone.addEventListener("dragover", (e) => e.preventDefault(), false);

  dropzone.addEventListener("dragenter", (e) =>
    e.target.classList.add("dragover")
  );

  dropzone.addEventListener("dragleave", (e) =>
    e.target.classList.remove("dragover")
  );

  return dropzone;
}
