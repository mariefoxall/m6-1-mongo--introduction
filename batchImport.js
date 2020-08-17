const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const assert = require("assert");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const fs = require("file-system");

const greetings = JSON.parse(fs.readFileSync("data/greetings.json"));

const batchImport = async () => {
  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("exercises");
    const r = await db.collection("greetings").insertMany(greetings);
    assert.equal(greetings.length, r.insertedCount);
    console.log({ status: 201, data: greetings, message: "you did it!" });
  } catch (err) {
    console.log(err.stack);
    console.log({ status: 500, data: greetings, message: err.message });
  }
  client.close();
  //   console.log(greetings);
};

batchImport();
