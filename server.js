const db = require("./db");
const express = require("express");
// const cookieParser = require("cookie-parser");
const path = require("path");
const cookieSession = require("cookie-session");

const { engine } = require("express-handlebars");

const app = express();

// set up handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
///////

app.use((req, res, next) => {
    console.log(`A ${req.method} request was made to the ${req.url} route`);
    next();
});

app.use(
    cookieSession({
        secret: process.env.SESSION_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        sameSite: true,
    })
);

// app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("./public")); // gets the hb css

let errorMessage;

app.get("/", (req, res) => {
    res.redirect("/register");
});

app.get("/register", (req, res) => {
    // TODO: if you're registered show link to /login route
    // else errormessage please register to sign the petition
});

app.post("/register", (req, res) => {
    // TODO: if you click on register button create account in Database
    // and redirect to profile page
    // else errormessage please register to sign the petition or login
});

app.get("/logout", (req, res) => {
    // TODO: req.session = 0 and redirect
    // else back to register/login 
});

app.get("/login", (req, res) => {
    // TODO: insert login data
    // press login button
    // else back to register/login
});

app.post("/login", (req, res) => {
    // TODO: get the profile data
    // render petition
    // else back to register/login
});

app.get("/petition", (req, res) => {
    if (!req.session.id) {
        console.log(req.session);
        res.render("home", {
            title: "Petition",
            errorMessage,
        });
    } else {
        res.redirect("/thank-you");
    }
});

app.post("/petition", (req, res) => {
    if (req.body.first.length && req.body.last.length && req.body.signature) {
        db.createUser(req.body.first, req.body.last, req.body.signature)
            .then((data) => {
                req.session.id = data[0].id;
                res.redirect("/thank-you");
            })
            .catch((err) => {
                console.log("err: ", err);
                res.render("welcome", {
                    title: "Petition",
                });
            });
    } else if (!req.body.first || !req.body.last || !req.body.signature) {
        res.render("home", {
            title: "Petition",
            errorMessage: !req.body.first,
            errorMessage: !req.body.last,
            errorMessage: !req.body.signature,
        });
    }
});

app.get("/thank-you", (req, res) => {
    Promise.all([db.getAllUser(), db.getSignature(req.session.id)]).then(
        (rows) => {
            if (req.session.id) {
                res.render("thank-you", {
                    title: "Petition",
                    signatureCount: rows[0].length,
                    signature: rows[0][0].signature,
                });
            } else {
                res.redirect("/");
            }
        }
    );
});

app.get("/signature", (req, res) => {
    if (req.session.id) {
        db.getAllUser().then((rows) => {
            console.log(rows);
            res.render("signature", {
                title: "Petition",
                signatures: rows,
            });
        });
    } else {
        res.redirect("/");
    }
});

// GET /profile
// check user should be signed in to get to the profile page
// check if user has already a profile
// renders form to input my profile info!

// POST /profile
// validate: age must be a number
// validate: city must be a text
// validate: homePage must be a valid URL // must start with https or http
// save form data into dtatabase

// GET /signers/:city //dynamic route!
// grab the city from the url
// call function db.getAllSignersByCity(city)

///////////////////////////////////

app.listen(8080, () => console.log("Server listening."));
