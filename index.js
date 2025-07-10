require("dotenv").config();

const express = require("express"); 
const {MongoClient} = require("mongodb");

const app = express();
const uri = process.env.MONGODB_URI;
let collection;

const cors = require("cors");
app.use(cors()); // allow all origins

MongoClient.connect(uri, { useUnifiedTopology: true })
  .then(client => {
    collection = client.db("test_database").collection("example_collection");
    console.log(collection)
    console.log("✅ Connected to MongoDB");
  })
  .catch(err => console.error(err));

app.get("/api/signals", async (req, res) => {
  try {

    const date = req.query.date || new Date().toISOString().slice(0,10);
    console.log(`Fetching signals for date: ${date}`);
    const doc = await collection.findOne({ "date": date});
    console.log(`Found document: ${JSON.stringify(doc)}`);
    res.json(doc?.signals || []);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API listening on port ${PORT}`));