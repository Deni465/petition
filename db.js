// loads all variables that are found in the .env file,
// and adds them to process.env! Now you can use them in your script below.

require("dotenv").config();
const spicedPg = require("spiced-pg");
const db_url = process.env.DATABASE_URL;
// console.log("🚀 ~ file: db.js ~ line 7 ~ process.env", process.env);
const bcrypt = require("bcryptjs");
// create a db object. it can talk to the database: use db.query(...)
console.log(db_url);
const db = spicedPg(db_url);

module.exports.getAllUser = function () {
    const sql = `SELECT * FROM signatures
    JOIN users ON signatures.user_id = user.id
    ORDER BY signatures.id DESC`;
    return db.query(sql);
};

module.exports.getUserByEmail = function (email) {
    const sql = "SELECT * FROM users WHERE email = $1";
    return db.query(sql, [email]);
};

module.exports.auth = function (email, password) {
    return this.getUserByEmail(email).then((result) => {
        return bcrypt
            .compare(password, result.rows[0].password)
            .then((crypt) => {
                return crypt;
            });
    });
};

module.exports.createUser = function (first, last, email, password) {
    return bcrypt
        .genSalt()
        .then((salt) => {
            return bcrypt.hash(password, salt);
        })
        .then((hashedPassword) => {
            const sql = `
        INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
            // Here we are using SAFE interpolation to protect against SQL injection attacks
            return db
                .query(sql, [first, last, email, hashedPassword])
                .then((result) => result.rows)
                .catch((error) => console.log("error inserting user", error));
        });
};

module.exports.getSignature = (id) => {
    const sql = "SELECT signature FROM signatures WHERE id=$1";
    return db
        .query(sql, [id])
        .then((result) => {
            return result.rows;
        })
        .catch((error) => {
            console.log("error selecting signature", error);
        });
};

module.exports.createProfile = (age, city, homepage, user_id) => {
    const sql = `
    INSERT INTO profiles (age, city, homepage, user_id)
    VALUES ($1, $2, $3, $4)
    Returning *;
    `;
    return db
        .query(sql, [age, city, homepage, user_id])
        .then((result) => result.rows)
        .catch((error) => console.log("error inserting profile", error));
};

module.exports.getAllSignersByCity = (city) => {
    const sql =
        "SELECT city FROM profiles JOIN users ON profiles.user_id = users.id JOIN signatures ON profiles.user_id = signatures.user_id WHERE city=$2";
    return db
        .query(sql, [city])
        .then((result) => {
            return result.rows;
        })
        .catch((error) => {
            console.log("error selecting city profiles", error);
        });
    //SELECT from 3 tables: profiles, signatures, users
    //(join them up!)
    // add the WHERE condition
};
