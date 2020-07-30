var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware"); // if we require a directory, it'll automatically require index.js file in it. (It's a special name)
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

// INDEX route
router.get("/", function(req, res){
	Campground.find({}, function(err, allCampgrounds){
		if (err) {
			req.flash('error', err.message);
			res.redirect('back');
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	})
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to campgrounds array
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  var newCampground = req.body.campground;
  geocoder.geocode(newCampground.location, function(err, data){
      if (err || !data.length) {
    	  req.flash('error', 'Invalid address: ' + newCampground.location);
    	  return res.redirect('back');
      }
      var lat = data[0].latitude;
      var lng = data[0].longitude;
      var location = data[0].formattedAddress
	  newCampground.author = author;
	  newCampground.location = location;
	  newCampground.lat = lat;
	  newCampground.lng = lng;
      // Create a new campground and save to DB
      Campground.create(newCampground, function(err, newlyCreated){
          if(err){
			  req.flash('error', err.message);
			  res.redirect('back');
          } else {
              //redirect back to campgrounds page
              console.log(newlyCreated);
              res.redirect("/campgrounds");
          }
      });
  });
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

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
  geocoder.geocode(req.body.campground.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
  });
});

// DESTROY cmpground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			req.flash('error', err.message);
			res.redirect("campgrounds");
		} else {
			res.redirect("campgrounds");
		}
	});
});

module.exports = router;