const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const { connectDatabase } = require("./database/DbConnect");

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
// // MongoDB Connection
connectDatabase();

// API Endpoints
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/tasks", require("./routes/tasks.routes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
