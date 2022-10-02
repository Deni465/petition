// loads all variables that are found in the .env file,
// and adds them to process.env! Now you can use them in your script below.

require("dotenv").config();
const spicedPg = require("spiced-pg");
const db_url = process.env.DATABASE_URL;
// console.log("🚀 ~ file: db.js ~ line 7 ~ process.env", process.env);

// create a db object. it can talk to the database: use db.query(...)
console.log(db_url);
const db = spicedPg(db_url);

module.exports.getAllUser = function () {
    const sql = "SELECT * FROM petition;";
    // NB! remember to RETURN the promise!
    return db
        .query(sql)
        .then((result) => {
            return result.rows;
        })
        .catch((error) => {
            console.log("error selecting user", error);
        });
};

module.exports.createUser = function (first, last, signature) {
    const sql = `
        INSERT INTO cities (first, last, signature)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    // Here we are using SAFE interpolation to protect against SQL injection attacks
    return db
        .query(sql, [first, last, signature])
        .then((result) => result.rows)
        .catch((error) => console.log("error inserting user", error));
};
