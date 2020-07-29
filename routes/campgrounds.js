var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware"); // if we require a directory, it'll automatically require index.js file in it. (It's a special name)

// INDEX route
router.get("/", function(req, res){
	Campground.find({}, function(err, allCampgrounds){
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	})
});

// CREATE route
router.post("/", middleware.isLoggedIn, function(req, res){
	// get data from form and add to campgrounds array
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = req.body.campground;
	campground.author = author;
	// Create a new campground and save to database
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			req.flash("error", "Campground was not created successfully.");
			res.redirect("/campgrounds");
		} else {
			// redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	})
});

// NEW route
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new.ejs");
});

// SHOW route - shows more info about one campground
// (Be CAREFUL!!! Need to put /campgrounds/new before, otherwise it will end up here)
router.get("/:id", function(req, res){
	// find campground with that specific ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "Campground not found.");
			// res.redirect("back");
			res.redirect("/campgrounds");
		} else {
			// render show template
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// EDIT campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});
// UPDATE campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DESTROY cmpground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("campgrounds");
		} else {
			res.redirect("campgrounds");
		}
	});
});

module.exports = router;