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
    const sql = `SELECT * FROM users
    LEFT OUTER JOIN profiles ON users.id = profiles.user_id
    JOIN signatures ON signatures.user_id = users.id
    ORDER BY users.id DESC;`;
    return db
        .query(sql)
        .then((result) => result.rows)
        .catch((error) => console.log("error in getting user", error));
};

module.exports.getUserByEmail = function (email) {
    const sql =
        "SELECT first, last, users.id, user_id, password FROM users LEFT JOIN signatures ON users.id = signatures.user_id WHERE email = $1";
    return db.query(sql, [email]);
};

module.exports.auth = function (email, password) {
    return this.getUserByEmail(email).then((result) => {
        return bcrypt
            .compare(password, result.rows[0].password)
            .then((crypt) => {
                return { crypt, user: result.rows[0] };
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

module.exports.createSignature = (signature, user_id) => {
    const sql = `
    INSERT INTO signatures (signature, user_id)
    VALUES ($1, $2)
    RETURNING user_id;
    `;
    return db
        .query(sql, [signature, user_id])
        .then((result) => result.rows)
        .catch((error) => console.log("error inserting signature", error));
};

module.exports.getSignature = (user_id) => {
    // console.log("getSig user_id", user_id);
    const sql = "SELECT signature FROM signatures WHERE user_id=$1;";
    return db
        .query(sql, [user_id])
        .then((result) => {
            // console.log("db.js getSignature", result);
            return result;
        })
        .catch((error) => {
            console.log("error selecting signature", error);
        });
};

module.exports.getAllSignatures = () => {
    const sql = "SELECT * FROM signatures";
    return db
        .query(sql)
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
        "SELECT * FROM profiles JOIN users ON profiles.user_id = users.id WHERE city=$1;";
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

module.exports.getUserInfo = (id) => {
    // console.log("First id", id);
    const sql =
        "SELECT * FROM users LEFT JOIN profiles ON profiles.user_id = users.id WHERE users.id = $1;";
    return db
        .query(sql, [id])
        .then((result) => {
            // console.log("db result", result);
            return result.rows;
        })
        .catch((error) => console.log("error in getting user info", error));
    // select - joining users & users profile tables
    // first, last, email
    // age, city, url
};

module.exports.updateUserDataWithPassword = (
    first,
    last,
    email,
    password,
    user_id
) => {
    return bcrypt
        .genSalt()
        .then((salt) => {
            return bcrypt.hash(password, salt);
        })
        .then((hashedPassword) => {
            const sql = `UPDATE users
            SET first=$1, last=$2, email=$3, password=$4 
            WHERE id = $5;`;
            return db.query(sql, [first, last, email, hashedPassword, user_id]);
        });
    // Update users...
};

module.exports.updateUserDataWithoutPassword = (
    first,
    last,
    email,
    user_id
) => {
    const sql = `UPDATE users
    SET first=$1, last=$2, email=$3
    WHERE id = $4;`;
    return db.query(sql, [first, last, email, user_id]);
};

module.exports.upsertUserProfileData = (age, city, homepage, user_id) => {
    const sql = `INSERT INTO profiles(age, city, homepage, user_id)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id)
    DO UPDATE set age=$1, city=$2, homepage=$3
    WHERE profiles.user_id = $4;`;
    return db.query(sql, [age, city, homepage, user_id]);
};

module.exports.deleteSignature = (user_id) => {
    const sql = `DELETE FROM signatures WHERE signatures.user_id = $1;`;
    return db
        .query(sql, [user_id])
        .then((result) => result.rows)
        .catch((error) => console.log("error deleting signature", error));
    // delete
};
