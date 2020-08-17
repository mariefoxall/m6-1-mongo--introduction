const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;
const mongoTwo = process.env.MONGO_URI;
console.log(MONGO_URI);
// console.log("process.env", process.env);
// console.log("mongoTwo", mongoTwo);

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const dbFunction = async (dbName) => {
  try {
    console.log("i'm in the function!");
    // creates a new client
    const client = await MongoClient(MONGO_URI, options);
    // connect to the client
    await client.connect();
    // connect to the database (db name is provided as an argument to the function)
    const db = client.db(dbName); // <-- changed this as well
    console.log("connected!");

    await db.collection("users").insertOne({ name: "Buck Rogers" });
    // close the connection to the database server
    client.close();
    console.log("disconnected!");
  } catch (error) {
    console.log(error);
  }
};

dbFunction("exercise_1");
