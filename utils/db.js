const mongoose = require("mongoose");

const URI = process.env.MONGDB_URI;
// mongoose.connect(URI)

const connectDb = async () => {
  try {
    await mongoose.connect(URI);
    console.log("connection succefull to db");
  } catch (error) {
    console.error("db connection faild");
    process.exit(0); //get out
  }
};

module.exports = connectDb;