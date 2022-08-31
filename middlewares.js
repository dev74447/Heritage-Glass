const Campground= require('./models/campground')
const { campgroundSchema } = require("./schemas");
const ExpressError = require("./ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validatecampground = (req, res, next) => {
    console.log(req.body);
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        // there the error are in array so convert then to string to show
        console.log("thrown from validator");
        const msg = error.details.map((e) => e.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You dont have permission to do that');
        res.redirect(`/campgrounds/${id}`);
    } else {
        next();
    }
}