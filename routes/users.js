const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const controllerUser = require("../controllers/user.js");

//signup form
router.get("/signup",controllerUser.renderSignupForm);

//signup authenticat
router.post("/signup", wrapAsync(controllerUser.signup));

//login form
router.get("/login", controllerUser.renderLoginForm);
//login authenticate
router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),controllerUser.login);


//logout
router.get("/logout", controllerUser.logOut);

module.exports = router;