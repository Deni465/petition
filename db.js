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
    const sql = `SELECT * FROM signatures
    JOIN users ON signatures.user_id = user.id
    ORDER BY signatures.id DESC`;
    return db.query(sql);
};

module.exports.createUser = function (first, last, signature) {
    const sql = `
        INSERT INTO users (first, last, signature)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    // Here we are using SAFE interpolation to protect against SQL injection attacks
    return db
        .query(sql, [first, last, signature])
        .then((result) => result.rows)
        .catch((error) => console.log("error inserting user", error));
};

module.exports.getSignature = (id) => {
    const sql = "SELECT signature FROM petition WHERE id=$1";
    return db
        .query(sql, [id])
        .then((result) => {
            return result.rows;
        })
        .catch((error) => {
            console.log("error selecting signature", error);
        });
};

module.exports.insertProfile = (user_id, age, city, homePage) => {
    //...
};

module.exports.getAllSignersByCity = (city)=>{
    //SELECT from 3 tables: profiles, signatures, users
    //(join them up!)
    // add the WHERE condition
}
