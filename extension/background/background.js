import login from "./handlers/login.js";
import logout from "./handlers/logout.js";

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "login") {
    await login();
  } else if (request.action === "logout") {
    await logout();
  } else if (request.action === "log") {
    console.log("POPUP: ", request);
  }
});
