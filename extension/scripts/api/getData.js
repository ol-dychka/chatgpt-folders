// Asynchronous function to send a GET request to the specified API endpoint and retrieve data.
//
// @param {string} destination - The API endpoint path appended to the
// base URL (`http://localhost:5000/api/`).
//
// The function sends a GET request to fetch data from the server. It includes the following headers:
// - "Content-Type": Specifies the request content type as JSON.
// - "User-Id": Adds the user identifier (`USER_ID`) to the request headers
//
// If the server responds with a non-OK status (not in the 2xx range),
// the function throws an error with the message "Response is not OK".
//
// The response data is parsed as JSON and returned if the request is successful.
//
// Errors during the fetch process (e.g., network issues) are caught, logged to the console,
// and rethrown for further handling.

async function getData(destination) {
  if (!USER_ID) return;
  console.log(USER_ID);
  try {
    const response = await fetch(`http://localhost:5000/api/${destination}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Id": `${USER_ID}`,
      },
    });

    if (!response.ok) {
      throw new Error("Response is not OK");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching: ", error);
    throw error;
  }
}
