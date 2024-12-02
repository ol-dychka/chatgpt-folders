function createDropzone(isTop, handleDrop) {
  const dropzone = document.createElement("div");
  dropzone.classList.add(isTop ? "dropzone-top" : "dropzone-bottom");

  dropzone.addEventListener("drop", (e) => handleDrop(e), false);

  dropzone.addEventListener("dragover", (e) => e.preventDefault(), false);
  dropzone.addEventListener("dragenter", (e) =>
    e.target.classList.add("dragover")
  );
  dropzone.addEventListener("dragleave", (e) =>
    e.target.classList.remove("dragover")
  );

  return dropzone;
}
