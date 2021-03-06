var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware"); // if we require a directory, it'll automatically require index.js file in it. (It's a special name)
var NodeGeocoder = require('node-geocoder');
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'yelpcampyunxiaoservice', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

// INDEX route
router.get("/", function(req, res){
	var noMatch;
	if (req.query.search) {
		// do fuzzy search
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		Campground.find({name: regex}, function(err, allCampgrounds){
			if (err) {
				req.flash('error', err.message);
				res.redirect('back');
			} else {
				if (allCampgrounds.length < 1) {
					var noMatch = "No camoground match that query, please try again.";
				}
				res.render("campgrounds/index", {campgrounds: allCampgrounds, noMatch: noMatch});
			}
		});
	} else {
		Campground.find({}, function(err, allCampgrounds){
			if (err) {
				req.flash('error', err.message);
				res.redirect('back');
			} else {
				res.render("campgrounds/index", {campgrounds: allCampgrounds, noMatch: noMatch});
			}
		});
	}
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res) {
  // get data from form and add to campgrounds array
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  var newCampground = req.body.campground;
  newCampground.author = author;
  geocoder.geocode(newCampground.location, function(err, data){
      if (err || !data.length) {
    	  req.flash('error', 'Invalid address: ' + newCampground.location);
    	  return res.redirect('back');
      }
      var lat = data[0].latitude;
      var lng = data[0].longitude;
      var location = data[0].formattedAddress
	  newCampground.location = location;
	  newCampground.lat = lat;
	  newCampground.lng = lng;
	  cloudinary.uploader.upload(req.file.path, function(result) {
		// add cloudinary url for the image to the campground object under image property
		newCampground.image = result.secure_url;
		newCampground.imageId = result.public_id;
		console.log(newCampground.image);
		Campground.create(newCampground, function(err, newlyCreated){
		  if(err){
			  req.flash('error', err.message);
			  res.redirect('back');
		  } else {
			  //redirect back to newCampground show page
			  res.redirect("/campgrounds/" + newlyCreated._id);
		  }
		});
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
router.put("/:id", middleware.checkCampgroundOwnership, upload.single('image'), function(req, res){
    Campground.findById(req.params.id, async function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
			campground.name = req.body.campground.name;
        	campground.description = req.body.campground.description;
			geocoder.geocode(req.body.campground.location, async function (err, data) {
				if (err || !data.length) {
				  req.flash('error', 'Invalid address');
				  return res.redirect('back');
				}
				campground.lat = data[0].latitude;
				campground.lng = data[0].longitude;
				campground.location = data[0].formattedAddress;
				if (req.file) {
				  	try {
					  	await cloudinary.v2.uploader.destroy(campground.imageId);
					  	var result = await cloudinary.v2.uploader.upload(req.file.path);
					  	campground.imageId = result.public_id;
					  	campground.image = result.secure_url;
				  	} catch(err) {
					  	req.flash("error", err.message);
					  	return res.redirect("back");
				  	}
				}
				campground.save();
				req.flash("success","Successfully Updated!");
				res.redirect("/campgrounds/" + campground._id);
			});
        }
    });
});

// DESTROY cmpground route
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findById(req.params.id, async function(err, campground) {
    if(err) {
      req.flash("error", err.message);
      return res.redirect("back");
    }
    try {
        await cloudinary.v2.uploader.destroy(campground.imageId);
        campground.remove();
        req.flash('success', 'Campground deleted successfully!');
        res.redirect('/campgrounds');
    } catch(err) {
        if(err) {
          req.flash("error", err.message);
          return res.redirect("back");
        }
    }
  });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;