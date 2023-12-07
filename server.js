//person-db, detail-colln, detail-schema

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// const uri = process.env.ATLAS_URI;
const uri = "mongodb+srv://Yashvi:Yashvi@cluster0.3h6csyt.mongodb.net/person";
mongoose.connect(uri);

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const Schema = mongoose.Schema;

// Create a Schema object
const detail = new Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    address: { type: String, required: true },
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  }
);

// This Activitry creates the collection called whatever the colln name given
const personModel = mongoose.model("details", detail);

app.get("/", (req, res) => {
  personModel
    .find()
    .then((details) => res.json(details))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.post("/add", async (req, res) => {
  const detail = req.body.detail;
  // create a new Activity object
  const newDetail = await new personModel(detail);
  console.log(newDetail);

  // save the new object (newActivity)
  newDetail
    .save()
    .then(() => res.json("detail added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.get("/:id", (req, res) => {
  console.log("just id" + req.params.id);
  personModel
    .findById(req.params.id)
    .then((detail) => res.json(detail))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.post("/update/:id", async (req, res) => {
  console.log(req.params.id);
  await personModel
    .findByIdAndUpdate(req.params.id, req.body.detail)
    .then((detailforedit) => {
      res.json("detail updated!");
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

app.delete("/delete/:id", async (req, res) => {
  console.log("delete logged");
  await personModel
    .findByIdAndDelete(req.params.id)
    .then(() => res.json("detail deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
