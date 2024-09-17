const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedin, isOwner, listingvalidate } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({storage})


router.route("/")
.get( wrapAsync(listingController.Index))
.post( isLoggedin,upload.single('listing[image]'), listingvalidate, wrapAsync(listingController.add));




//_____________________________________________
router.get("/new", isLoggedin, listingController.renderNewform);

//________________________________________________


router.route("/:id")
.get( wrapAsync(listingController.Show))
.put( isLoggedin, isOwner, upload.single('listing[image]'), listingvalidate, wrapAsync(listingController.update))
.delete( isLoggedin, isOwner, wrapAsync(listingController.delete));

//_________________________________________

// update route form
router.get("/:id/edit", isLoggedin, isOwner, wrapAsync(listingController.randerUpdateform));


module.exports = router;