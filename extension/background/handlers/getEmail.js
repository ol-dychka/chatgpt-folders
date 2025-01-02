export default async function getEmail() {
  const { id } = await chrome.storage.local.get("id");
  if (!id) return null;

  try {
    const response = await fetch(`http://localhost:5000/api/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("RESP: ", response);
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      return data;
    }
  } catch (error) {
    console.log("Error fetching: ", error);
    throw error;
  }
}
