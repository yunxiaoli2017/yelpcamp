var mongoose 	= require("mongoose");
var Campground 	= require("./models/campground");
var User 	= require("./models/user");
var Comment 	= require("./models/comment");

var data = [
	{
		name: "Cloud's Rest",
		image: "https://images.pexels.com/photos/803226/pexels-photo-803226.jpeg?auto=compress&cs=tinysrgb&h=350",
		description: "Clouds rest here. So do we."
	},
	{
		name: "Desert Mesa",
		image: "https://images.pexels.com/photos/410074/pexels-photo-410074.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
		description: "Better than Joshua Tree?"
	},
	{
		name: "Canyon Floor",
		image: "https://images.pexels.com/photos/545964/pexels-photo-545964.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
		description: "Never been there before."
	}
];

function seedDB(){
	Campground.deleteMany({}, function(err){
		if(err){
			console.log(err);
		}
		console.log("removed campgrounds!");
		
		User.deleteMany({}, function(err){
			if(err){
				console.log(err);
			}
			console.log("removed users!");
		})
		//add a few campgrounds
		// data.forEach(function(seed){
		// 	Campground.create(seed, function(err, campground){
		// 		if(err){
		// 			console.log(err);
		// 		} else {
		// 			console.log("added a campground");
		// 			//add a few comments
		// 			Comment.create(
		// 				{
		// 					text: "This place is great, but I wish there was internet.",
		// 					author: "Homer"
		// 				}, function(err, comment){
		// 					if(err){
		// 						console.log(err);
		// 					} else {
		// 						campground.comments.push(comment);
		// 						campground.save();
		// 						console.log("created a comment");
		// 					}
		// 				});
		// 		}
		// 	})
		// });
		
	});
}

module.exports = seedDB;



