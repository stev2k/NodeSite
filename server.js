const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const uri = process.env.CUSTOMCONNSTR_mongo;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(3000, function () {
  console.log("listening on 3000");
});
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
  client.connect(function (err, db) {
    const cursor = client
      .db("testdb")
      .collection("testcollection")
      .find()
      .toArray()
      .then((results) => {
        console.log(results);
      });
  });
});
app.use(bodyParser.urlencoded({ extended: true }));
app.post("/quotes", (req, res) => {
  client.connect(function (err, db) {
    const collection = client.db("testdb").collection("testcollection");
    collection.insertOne(req.body, function (err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
    res.status(204).send();
  });
});
