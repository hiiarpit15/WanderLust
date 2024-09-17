const Listing = require("./models/listing");
const Review = require("./models/review");
const reviewSchema = require("./schema.js").reviewSchema;
const listingSchema = require("./schema.js").listingSchema;
const ExpressError = require("./utils/expressError.js");

module.exports.isLoggedin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    //save original path were user want to go
    req.session.redirectUrl = req.originalUrl;
    // console.log(req.session.redirectUrl);
    req.flash("error", "First login to do Perform further action");
    return res.redirect("/login");
  }
  next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    // console.log(req.session.redirectUrl);
  }
  next();
}

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.isAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
//validation for review schema
module.exports.reviewvalition = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};
//listings vaidation funtion
module.exports.listingvalidate = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};