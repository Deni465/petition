const db = require("./db");
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

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

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("./public")); // gets the hb css

let errorMessage;

app.get("/", (req, res) => {
    // console.log("Hey there!");
    if (!req.cookies.PETITION_SIGNED) {
        res.render("home", {
            title: "Petition",
            errorMessage,
        });
    } else {
        res.redirect("/thank-you");
    }

    // if user has NOT signed:
    //    render the petition page with the form
    // else
    //    REDIRECT to thank-you page
});

app.post("/", (req, res) => {
    if (req.body.first.length > 0 && req.body.last.length > 0) {
        // TODO: check if signature
        // TODO: store input data in database
        db.createUser(req.body.first, req.body.last, "to be continued").then(
            () => {
                res.cookie("PETITION_SIGNED", true);
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

    // check input: first, last names, signature
    // if they are VALID:
    //     STORE in database db.createUser?
    //     SET a cookie
    //     REDIRECT to thank-you page
    // else:
    //     show the form again with an error message
});

app.get("/thank-you", (req, res) => {
    if (req.cookies.PETITION_SIGNED) {
        db.getAllUser().then((rows) => {
            console.log(rows);
            res.render("thank-you", {
                title: "Petition",
                signatureCount: rows.length,
            });
        });
    } else {
        res.redirect("/");
    }

    // if user has signed:
    //     Get data from db
    //     Show info: thank you for signing + how many people have signed
    // else:
    //     REDIRECT to home/petition page
});

app.get("/signature", (req, res) => {
    if (req.cookies.PETITION_SIGNED) {
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
