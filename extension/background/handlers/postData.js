export default async function postData(destination, body) {
  try {
    const response = await fetch(`http://localhost:5000/api/${destination}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Response is not OK");
    }

    return await response.json();
  } catch (error) {
    console.log("Error fetching: ", error);
    throw error;
  }
}
