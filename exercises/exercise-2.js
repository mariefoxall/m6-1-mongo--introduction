const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const assert = require("assert");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const createGreeting = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    console.log(req.body);
    const db = client.db("exercises");

    const r = await db.collection("greetings").insertOne(req.body);
    assert.equal(1, r.insertedCount);
    res.status(201).json({ status: 201, data: req.body });
  } catch (error) {
    console.log(error.stack);
    res
      .status(500)
      .json({ status: 500, data: req.body, message: error.message });
    //   client.close();
  }
  client.close();
};

const getGreeting = async (req, res) => {
  const _id = req.params._id;
  try {
    const client = await MongoClient(MONGO_URI, options);

    await client.connect();
    const db = client.db("exercises");
    const greeting = await db
      .collection("greetings")
      .findOne({ _id }, (err, result) => {
        result
          ? res.status(200).json({ status: 200, _id, data: result })
          : res.status(404).json({ status: 404, _id, data: "not found" });
        client.close();
      });
  } catch (error) {
    console.log(error);
  }
};

const getGreetings = async (req, res) => {
  console.log("req.query", req.query);
  const start = await Number(req.query.start);

  const limit = await Number(req.query.limit);
  console.log("start", start, "limit", limit);
  let end = 0;

  if (start && limit) {
    end = start + limit;
  } else if (limit) {
    end = limit;
  }
  console.log("end", end);

  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("exercises");

    const data = await db.collection("greetings").find().toArray();

    console.log(data.length);

    if (start > data.length) {
      res
        .status(404)
        .json({ status: 404, data: `we only have ${data.length} entries` });
    } else if (start && limit) {
      res.status(200).json({
        status: 200,
        start: start,
        limit: Math.min(limit, data.length - start),
        data: data.slice(start - 1, Math.min(end, data.length)),
      });
    } else if (limit) {
      res.status(200).json({
        status: 200,
        start: start,
        limit: Math.min(limit, data.length - start),
        data: data.slice(0, Math.min(end, data.length)),
      });
    } else if (data.length > 25) {
      res.status(200).json({ status: 200, data: data.slice(0, 25) });
    } else if (data.length) {
      res.status(200).json({ status: 200, data: data });
    } else {
      res.status(404).json({
        status: 404,
        data: "we can't find what you're looking for.",
      });
    }
  } catch (error) {
    console.log(error);
  }
  client.close();
};

const deleteGreeting = async (req, res) => {
  const _id = req.params._id;

  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("exercises");

    const r = await db.collection("greetings").deleteOne({ _id });
    assert.equal(1, r.deletedCount);
    res
      .status(200)
      .json({ status: 200, data: _id, message: "one entry deleted" });
  } catch (error) {
    console.log(error.stack);
    res.status(500).json({ status: 500, data: _id, message: error.message });
    //   client.close();
  }
  client.close();
};

const updateGreeting = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const _id = req.params._id;
  try {
    const query = { _id };
    let newValues = {};

    if (req.body.hello) {
      newValues = { $set: { hello: req.body.hello } };
    } else {
      throw new Error("please enter an update for 'hello'");
    }

    await client.connect();
    const db = client.db("exercises");

    const r = await db.collection("greetings").updateOne(query, newValues);
    // await db
    //   .collection("greetings")
    //   .updateOne({ _id: "KY" }, { $set: { hello: "salut" } });
    assert.equal(1, r.matchedCount);
    assert.equal(1, r.modifiedCount);

    res.status(200).json({ status: 200, data: _id, ...req.body });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: 500, data: _id, message: error.message });
  }
  client.close();
};

module.exports = {
  createGreeting,
  getGreeting,
  getGreetings,
  deleteGreeting,
  updateGreeting,
};
