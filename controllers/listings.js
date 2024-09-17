const Listing = require("../models/listing.js");


module.exports.Index = async (req, res) => {
    let alllistings = await Listing.find();
    // console.log(alllistings);
    res.render("./listings/index.ejs", { alllistings });
}

module.exports.renderNewform = (req, res) => {
    res.render("./listings/new.ejs")
};

module.exports.Show = async (req, res) => {
    let { id } = req.params;
    let listingdetail = await Listing.findById(id).populate({ path: "review", populate: { path: "author", }, }).populate("owner");
    if (!listingdetail) {
        req.flash("error", "Listing you seach does not exit");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listingdetail });
}

module.exports.add = async (req, res) => {
 
    let url = req.file.path;
    let filename = req.file.filename;
    const newListings = await new Listing(req.body.listing);

    newListings.owner = req.user._id;
    newListings.image = {url , filename};
    await newListings.save();
    req.flash("success", "Listing successfully added");
    res.redirect("/listings");
}

module.exports.randerUpdateform = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you seach does not exit");
        res.redirect("/listings");
    }
    let originalurl = listing.image.url;
    originalurl =  originalurl.replace("/upload", "/upload/h_250,w_300")
    res.render("./listings/edit.ejs", { listing , originalurl });

}

module.exports.update = async (req, res) => {

    let { id } = req.params;
    // console.log(id);
   let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  
   if(req.file){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save()
   }

    req.flash("success", "Listing successfully update");

    res.redirect(`/listings/${id}`);
}

module.exports.delete = async (req, res) => {
    let { id } = req.params;
    // console.log(id);
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing successfully delete");
    res.redirect("/listings");
}