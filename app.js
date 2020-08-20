require("dotenv").config();
var express 		= require("express"),
	bodyParser 		= require("body-parser"),
	app 			= express(),
	mongoose 		= require("mongoose"),
	flash 			= require("connect-flash"),
	passport 		= require("passport"),
	LocalStrategy 	= require("passport-local"),
	methodOverride 	= require("method-override"),
	Campground 		= require("./models/campground"),
	Comment 		= require("./models/comment"),
	User 			= require("./models/user"),
	seedDB 			= require("./seeds");

// requiring routes
var commentRoutes 		= require("./routes/comments"),
	campgroundRoutes 	= require("./routes/campgrounds"),
	indexRoutes 		= require("./routes/index");

var databaseURL = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(databaseURL);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
// __dirname will always be the directory the script lives in
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: process.env.PASSPORT_SECRET,
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	// if we do not have this next(); this middleware will just stop.
	next();
});

// clear Campground and User database
// seedDB();

// naming convention RESTFUL routes
// REST - mapping between html routes and CRUD (Create, Read, Update, Destroy)

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(process.env.PORT || 4000, function(){
	console.log("Yelp Camp is listening!");
});     