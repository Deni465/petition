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
    // console.log("Hey there!");
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

app.post("/", (req, res) => {
    if (
        req.body.first.length > 0 &&
        req.body.last.length > 0 &&
        req.body.signature.length > 0
    ) {
        // TODO: check if signature
        // TODO: store input data in database
        db.createUser(req.body.first, req.body.last, req.body.signature).then(
            (data) => {
                req.session.id = data[0].id;
                res.redirect("/thank-you");
            }
        );
    } else if (req.body.first.length == 0) {
        // TODO: Regex
        errorMessage = "Please insert your first name";
        res.redirect("/");
    } else if (req.body.last.length == 0) {
        // TODO: Regex
        errorMessage = "Please insert your last name";
        res.redirect("/");
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
    // if user has signed:
    //     Get data from db
    //     Show info: all previous signatures
    // else:
    //     REDIRECT to home/petition page
});

///////////////////////////////////

app.listen(8080, () => console.log("Server listening."));
