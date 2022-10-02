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

// // Cookie middleware
// function cookieCheck(req, res, next) {
//     if (req.cookies.COOKIES_ACCEPTED) {
//         console.log("Yes, we have a cookie 🍪");
//         next();
//     } else if (req.url !== "/cookie" && req.url !== "/favicon.ico") {
//         res.cookie("REDIRECT_URL", req.url);
//         res.redirect("/cookie");
//     } else {
//         next();
//     }
// }

// app.use(cookieCheck);

app.use(express.static("./public")); // gets the hb css

// Example of how to use the db object to select some rows:
// db.getAllCities().then((rows) => {
//     console.log("Here are all the cities");
//     console.log(rows);
// });

// ....

app.get("/", (req, res) => {
    // console.log("Hey there!");
    if (req.body.first == "" && req.body.last == "") {
        res.render("home", {
            title: "Petition",
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
    // check input: first, last names, signature
    // if they are VALID:
    //     STORE in database db.createUser?
    //     SET a cookie 
    //     REDIRECT to thank-you page
    // else:
    //     show the form again with an error message
});

app.get("/thank-you", (req, res) => {
    res.render("thank-you", {
        title: "Petition",
    });

    // if user has signed:
    //     Get data from db
    //     Show info: thank you for signing + how many people have signed
    // else:
    //     REDIRECT to home/petition page
});

app.get("/signature", (req, res) => {
    res.render("signature", {
        title: "Petition",
    });
    // if user has signed:
    //     Get data from db
    //     Show info: all previous signatures
    // else:
    //     REDIRECT to home/petition page
});

///////////////////////////////////

app.listen(8080, () => console.log("Server listening."));
