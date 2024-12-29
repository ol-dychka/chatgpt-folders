// Asynchronous function to send a POST request to the specified API endpoint with a JSON body.
//
// @param {string} destination - The API endpoint path appended to the
// base URL (`http://localhost:5000/api/`).
// @param {object} body - The data to be sent in the body of the POST request,
// which is converted to JSON.
//
// The function sends a POST request to create or update a resource on the server.
// It includes the following headers:
// - "Content-Type": Specifies the request content type as JSON.
// - "User-Id": Adds the user identifier (`USER_ID`) to the request headers.
//
// The body of the request is serialized as a JSON string.
//
// If the server responds with a non-OK status (not in the 2xx range),
// the function throws an error with the message "Response is not OK".
//
// Errors during the fetch process (e.g., network issues) are caught, logged to the console,
// and rethrown for further handling.

async function postData(destination, body) {
  try {
    const response = await fetch(`http://localhost:5000/api/${destination}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Id": `${USER_ID}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Response is not OK");
    }
  } catch (error) {
    console.log("Error fetching: ", error);
    throw error;
  }
}
