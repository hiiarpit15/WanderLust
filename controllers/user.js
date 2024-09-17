const User = require("../models/user.js");

module.exports.renderSignupForm =  (req, res) => {
    res.render("./users/signup.ejs");
    console.log(req.session.redirectUrl);
};

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newuser = new User({ username, email });
        const registerUser = await User.register(newuser, password);
        req.login(registerUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("./users/login.ejs");
};

module.exports.login =  (req, res) => {
    req.flash("success", "Welcome to Wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};
module.exports.logOut = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You logout successfully")
        res.redirect("/listings");
    });

};