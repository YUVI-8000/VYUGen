require('dotenv').config({ path: '../.env' });
const mongoose = require("mongoose");
const initData = require("./data.js");
const Ppr = require("../models/ppr.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/samplePpr";
const dbUrl = process.env.MONGO_URL

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

const initDB = async () => {
    await Ppr.deleteMany({});
    await Ppr.insertMany(initData.data);
    console.log("data was initialized");
  };
  
initDB();