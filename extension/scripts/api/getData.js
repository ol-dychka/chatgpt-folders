async function getData(destination) {
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
