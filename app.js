if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

// console.log(process.env.CLOUD_NAME) 

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const listingRoute = require("./routes/listings.js");
const reviewRoute = require("./routes/review.js");
const userRoute = require("./routes/users.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local")
const User = require("./models/user.js");






let app = express();
let port = 8080;
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

let atlasUrl = process.env.ATLAS_DB;
main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    mongoose.connect(atlasUrl);
}

const store =  MongoStore.create({ 
    mongoUrl: atlasUrl,
    crypto:{
        secret: "mysupersecretcode"
    },
    touchAfter: 24 * 3600,
})

//sessions
const sessionOption = {
    store, 
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expiry: Date.now() * 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//flash funtion
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})



app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewRoute);
app.use("/", userRoute);

app.all("*", (req, res, next) => {
    next(new ExpressError(401, "Page not found"));
})



// err handler
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Some thing went wrong" } = err;
    // res.status(statusCode).send(message);
    res.render("err.ejs", { message });

    // console.log(message);
})
app.listen(port, () => {
    console.log("server listen to port 8080");
});
