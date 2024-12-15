import { MongoClient } from "mongodb";
import "dotenv/config";

// Replace the uri string with your connection string.
const uri = process.env.MONGODB_URI;
console.log(uri);

const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db("sample_mflix");
    const movies = database.collection("movies");

    // Query for a movie that has the title 'Back to the Future'
    const query = { title: "Back to the Future" };
    const movie = await movies.findOne(query);

    console.log("movie: ", movie);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
