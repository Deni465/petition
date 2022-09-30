// loads all variables that are found in the .env file,
// and adds them to process.env! Now you can use them in your script below.
const { config } = require("dotenv");

const spicedPg = require("spiced-pg");
const DATABASE_URL = process.env.DATABASE_URL;

// create a db object. it can talk to the database: use db.query(...)
const db = spicedPg(DATABASE_URL);
