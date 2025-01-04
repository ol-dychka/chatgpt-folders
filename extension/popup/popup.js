const label = document.getElementById("label");
const authButton = document.getElementById("google-auth");

async function isLoggedIn() {
  const { email } = await chrome.storage.local.get("email");
  if (email) return true;
  return false;
}

async function update(email) {
  if (email) {
    label.innerText = `Logged in as \n${email}`;
    authButton.textContent = "Log out";
  } else {
    label.innerText = "Not logged in";
    authButton.textContent = "Log in with Google";
  }
}

authButton.addEventListener("click", async () => {
  const isLogged = await isLoggedIn();
  window.close();
  if (isLogged) chrome.runtime.sendMessage({ action: "logout" });
  else {
    chrome.runtime.sendMessage({ action: "login" });
  }
});

chrome.storage.local.get("email").then(({ email }) => {
  update(email);
});
