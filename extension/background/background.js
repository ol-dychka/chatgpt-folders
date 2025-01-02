import auth from "./handlers/auth.js";
import getEmail from "./handlers/getEmail.js";

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "getEmail") {
    getEmail().then((email) => {
      sendResponse({ email });
    });
    return true; // This keeps the message port open for the async sendResponse
  } else if (request.action === "auth") {
    auth();
  } else if (request.action === "log") {
    console.log("POPUP: ", request);
  }
});
