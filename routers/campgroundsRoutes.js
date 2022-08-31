const express = require('express');
const router = express.Router();
const Campground = require("../models/campground");
const { validatecampground, isLoggedIn, isAuthor } = require('../middlewares');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

//================================= CRUD functionality===========
// here order matters
// new
router.get("/new",isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});
router.post("/", validatecampground, async (req, res, next) => {
  try {
    const geoData = await geocoder.forwardGeocode({
      query: req.body.campground.location,
      limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    console.log(campground.geometry);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a campground!');
    res.redirect(`/sites/${campground.id}`);
  } catch (e) {
    next(e);
  }
});
// showing all
router.get("/", async (req, res, next) => {
  try {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  } catch (e) {
    next(e);
  }
});
// showing details
router.get("/:id", async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id).populate({
      path: 'reviews',
      populate: {
        path: 'author'
      }
    }).populate('author');
    if (!campground) {
      req.flash('error', 'Cannot find the campground!');
      return res.redirect('/sites');
    }
    res.render("campgrounds/show", { campground });
  } catch (e) {
    next(e);
  }
});
//edit and update
router.get("/:id/edit", isLoggedIn, isAuthor, async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash('error', 'Cannot find that campground!');
      return res.redirect('/sites');
    }
    res.render("campgrounds/edit", { campground });

  } catch (e) {
    next(e);
  }
});

router.put("/:id", validatecampground, async (req, res, next) => {
  try {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash('success', 'Successfully Updated a campground!');
    res.redirect(`/sites/${campground.id}`);
  } catch (e) {
    next(e);
  }
});
//delete
router.delete("/:id", isLoggedIn, isAuthor, async (req, res, next) => {
  try {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted a campground!');
    res.redirect("/sites");
    console.log("deleted");
  } catch (e) {
    next(e);
  }
});


module.exports = router;