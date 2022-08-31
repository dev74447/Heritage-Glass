if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const ExpressError = require("./ExpressError");
const passport = require('passport');
const LocalStrategies = require('passport-local');
const User = require('./models/user');

///// mongose conection
const mongoose = require("mongoose");
// const dbUrl= process.env.DB_URL || "mongodb://localhost:27017/yelp-camp"
const dbUrl= process.env.DB_URL
// const dbUrl= "mongodb://localhost:27017/yelp-camp"
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  // useCreateIndex: true,  (guess this command is deprecated now ) other two are also not needed
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("databased connected");
});

const app = express();
const port = process.env.PORT || 3000;

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
// for adding public directories views
app.use(express.static(path.join(__dirname, 'public')));

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})
// configration of session but what it suse now idont know
const sessionConfig = {
  store,
  name: 'session',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
      httpOnly: true,
      // secure: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

app.use(session(sessionConfig));


// passport initilization
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategies(User.authenticate()));
// these two  start and delete the session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// connecting the flash
app.use(flash());
app.use((req, res, next) => {
  // if (!['/login', '/'].includes(req.originalUrl)) {
  //   req.session.returnTo = req.originalUrl;
  // }
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});


// =============================== the routing  oaths have started=============//
// requiring rounters
const campgroundRoutes = require("./routers/campgroundsRoutes");
const reviewsRoutes = require("./routers/reviewsRoutes");
const registerRoutes = require('./routers/registerRoutes');
const Campground = require("./models/campground");

// order is very important first REQ then RES
app.get("/", (req, res) => {
  res.render("home");
});

// router
app.use('/', registerRoutes)
app.use("/sites", campgroundRoutes);
app.use("/sites/:id/reviews", reviewsRoutes);

// for globe page
app.use("/globe", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('globe', { campgrounds })
});

/// if nothing found
// app.all('*', (req, res, next) => {
//   console.log("this is the thing");
//   next(new ExpressError("Page Not found", 404));
// });

//custom error handler class
app.use((err, req, res, next) => {
  const { statusCode = 500, message = " something went wrong" } = err;
  res.status(statusCode).render("error", { err });
  next(err);
});

app.listen(port, (req, res) => {
  console.log("listening in port 3000");
});
