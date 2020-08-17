const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getUsers = async (req, res) => {
  try {
    const client = await MongoClient(MONGO_URI, options);

    await client.connect();
    const db = client.db("exercise_1");

    const users = await db.collection("users").find().toArray();

    if (!users.length) {
      res.status(404);
    } else {
      res.status(200).json(users);
    }

    console.log(users);

    client.close();
    return users;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getUsers };
