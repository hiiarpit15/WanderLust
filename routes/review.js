const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedin, isAuthor, reviewvalition } = require("../middleware.js");
const controllerReview = require("../controllers/review.js");


//Review route
router.post("/", isLoggedin, reviewvalition, wrapAsync(controllerReview.addReview));

//Review delete route
router.delete("/:reviewId", isLoggedin, isAuthor, wrapAsync(controllerReview.delete));

module.exports = router;
