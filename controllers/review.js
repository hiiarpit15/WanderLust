const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
  
  module.exports.addReview = async (req, res) => {
    // console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.review.push(newReview);
    await listing.save();
    (await newReview.save());
    // console.log("work complete");
    req.flash("success", "Review successfully added");
    res.redirect(`/listings/${req.params.id}`);
 };

 module.exports.delete = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review successfully deleted");
 
    res.redirect(`/listings/${req.params.id}`);
    // console.log(id);
 };