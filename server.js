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

function isLoggedIn(req, res, next) {
    if (req.session.id) {
        next();
    } else {
        res.redirect("/login");
    }
}

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
    console.log("Yes, register page!");
    res.render("register", {
        title: "Petition",
    });
    // TODO: if you're registered show link to /login route
    // else errormessage please register to sign the petition
});

app.post("/register", (req, res) => {
    db.createUser(
        req.body.first,
        req.body.last,
        req.body.email,
        req.body.password
    )
        .then((data) => {
            req.session.id = data[0].id;
            req.session.first = data[0].first;
            req.session.last = data[0].last;
            console.log(req.session);

            res.redirect("/profile");
        })
        .catch((err) => {
            console.log("err in register: ", err);
            // res.redirect("/register");
        });
    // TODO: if you click on register button create account in Database
    // and redirect to profile page
    // else errormessage please register to sign the petition or login
});

app.get("/login", (req, res) => {
    console.log("Yes, login page!");

    res.render("login", {
        title: "Petition",
    });

    // TODO: insert login data (email, password)
    // press login button
    // else back to register/login
});

app.post("/login", (req, res) => {
    db.auth(req.body.email, req.body.password).then((authentication) => {
        // console.log(crypt);
        // req.session new cookie session
        if (authentication.crypt) {
            req.session.id = authentication.user.id;
            req.session.first = authentication.user.first;
            req.session.last = authentication.user.last;
            res.redirect("/petition");
        } else {
            res.render("login", {
                title: "Petition",
            });
        }
    });

    // TODO: get the profile data
    // render petition
    // else back to register/login
});

app.get("/logout", isLoggedIn, (req, res) => {
    req.session = 0;
    res.redirect("/register");
});

app.get("/profile", isLoggedIn, (req, res) => {
    console.log("Yes, profile is there!");
    res.render("profile", {
        title: "Petition",
    });
});
// GET /profile
// check user should be signed in to get to the profile page
// check if user has already a profile
// renders form to input my profile info!

app.post("/profile", isLoggedIn, (req, res) => {
    console.log(req.body);
    db.createProfile(
        req.body.age,
        req.body.city,
        req.body.homePage,
        req.session.id
    )
        .then((data) => {
            res.redirect("/petition");
        })
        .catch((err) => {
            console.log("err in create profile: ", err);
            // res.redirect("/register");
        });
});

// POST /profile
// validate: age must be a number
// validate: city must be a text
// validate: homePage must be a valid URL // must start with https or http
// save form data into database

app.get("/petition", isLoggedIn, (req, res) => {
    res.render("home", {
        title: "Petition",
    });
    console.log(req.session.id);
});

app.post("/petition", isLoggedIn, (req, res) => {
    console.log(req.body);
    if (req.session.id) {
        db.createSignature(req.body.signature, req.session.id)
            .then((data) => {
                console.log({ data });
                req.session.signatureId = data[0].id;
                res.redirect("/thank-you");
            })
            .catch((err) => {
                console.log("error in creating signature:", err);
            });
    }

    console.log("Here is the signature", req.body.signature);
    // TODO: safe signature img in database
});

app.get("/thank-you", isLoggedIn, (req, res) => {
    db.getAllSignatures().then((rows) => {
        console.log(rows);
        const newSig = rows.find((row) => row.id === req.session.signatureId);
        if (req.session.id) {
            res.render("thank-you", {
                title: "Petition",
                signatureCount: rows.length,
                signature: newSig.signature,
            });
        } else {
            res.redirect("/");
        }
    });
});

app.get("/signature", isLoggedIn, (req, res) => {
    db.getAllUser().then((rows) => {
        console.log(rows);
        res.render("signature", {
            title: "Petition",
            users: rows,
        });
    });
});

app.get("/signature/:city", (req, res) => {
    db.getAllSignersByCity(req.params.city).then((rows) => {
        console.log(rows);
        res.render("signaturePerCity", {
            title: "Petition",
            users: rows,
        });
    });
});
// GET /signature/:city //dynamic route!
// grab the city from the url
// call function db.getAllSignersByCity(city)

// app.get("/profile/edit", (req, res) => {
//     // validation: user must be logged in session.id
//     // getAllUserInfo
//     // use this info to pass to handlebars
//     //render template: profile-edit
// });

// app.post("/profile/edit", (req, res) => {
//     // validation: user must be signed in
//     // validation: mandatory fields must be filled in -
//     // fist, last, email - mailo should not be in use
//     // optional fields: validate as in the post profile route
//     // pasword?
//     // if validation fails render with error
//     // update tables:
//     // users table -
//     //  if password is given update first, last, email, password
//     //  else update first, last, email
//     // user profiles table -
//     // "UPSERT" user data into the table
//     // redirect to petition page
// });

// app.post("/signature/delete", (req, res) => {
//     // validation: user signed in, (user has signed)
//     // db.delete...
//     // remove 'signed' from session!
//     // redirect to the petition route
//     // Partial! - HB shown button but is input in form, method post -> type submit, class button action, value delete signature
// });

///////////////////////////////////

app.listen(8080, () => console.log("Server listening."));
