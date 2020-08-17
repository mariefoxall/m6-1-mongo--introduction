const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const addUser = async (req, res) => {
  console.log(req.body);
  const newEntry = req.body;
  try {
    const client = await MongoClient(MONGO_URI, options);

    await client.connect();
    const db = client.db("exercise_1");

    await db.collection("users").insertOne(newEntry);

    res.status(201).json(newEntry);

    client.close();
    return users;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { addUser };
