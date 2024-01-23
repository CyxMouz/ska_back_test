const mongoose = require("mongoose");

module.exports.connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);

    console.log("Connected to db");
  } catch (error) {
    console.error("db conn ERR:", error.message);
  }
};
