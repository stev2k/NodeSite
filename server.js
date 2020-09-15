require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const uri = process.env.CUSTOMCONNSTR_MONGO;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.set("view engine", "ejs");
app.listen(process.env.PORT, function () {
  console.log("listening on " + process.env.PORT);
});
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  client.connect(function (err, db) {
    const cursor = client
      .db("testdb")
      .collection("testcollection")
      .find()
      .toArray()
      .then((results) => {
        console.log(results);
        res.render("index.ejs", { quotes: results });
      });
  });
});

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
