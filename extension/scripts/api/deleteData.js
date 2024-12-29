// Asynchronous function to send a DELETE request to API endpoint.
//
// @param {string} destination - The API endpoint path appended to the
// base URL (`http://localhost:5000/api/`).
//
// The function sends a DELETE request to remove a resource from the server.
// It includes the following headers:
// - "Content-Type": Specifies the request content type as JSON.
// - "User-Id": Adds the user identifier (`USER_ID`) to the request headers
//
// If the server responds with a non-OK status (not in the 2xx range),
// the function throws an error with the message "Response is not OK".
//
// Errors during the fetch process (e.g., network issues) are caught, logged to the console,
// and rethrown for further handling.

async function deleteData(destination, body) {
  try {
    const response = await fetch(`http://localhost:5000/api/${destination}`, {
      method: "DELETE",
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
