var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    methodOverride = require("method-override"),
    flash          = require("connect-flash");

var passport      = require("passport"),
    LocalStrategy = require("passport-local");

var Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    User       = require("./models/user");
    
// var seedDB = require("./seed");
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index");

//connect to the database////
var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v10delayed";
mongoose.connect(url);

//seed
// seedDB();

//Set up view engine as ejs
app.set("view engine", "ejs");

//Set up bodyParser
app.use(bodyParser.urlencoded({extended: true}));

//public
app.use(express.static(__dirname + "/public"));

//methodOverride
app.use(methodOverride("_method"));

//flash
app.use(flash());

////passport////
app.use(require("express-session")({
    secret: "This is the first authentication test",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
////////////////

app.use(function(req, res, next) {
    res.locals.user =  req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp Server has started!");
});