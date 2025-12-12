const express = require("express");
const serverless = require("serverless-http");
const mongoose = require("mongoose");

const app = express();

// Middlewares
app.use(express.json());

// Example route
app.get("/test", (req, res) => {
  res.json({ message: "API working on Vercel!" });
});

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

module.exports = serverless(app);
