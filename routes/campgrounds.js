var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware")

//INDEX ROUTE
router.get("/", function(req, res){
	// Get all the campground from db
	
	Campground.find({}, function(err, allcampgrounds){
		if(err){
			console.log(err);
		}else{
				res.render("campgrounds/index", {campgrounds : allcampgrounds });
		}
	})
});


//NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res){
		res.render("campgrounds/new");
});


//CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req, res){
		//get data from form and add to campgrounds and redirect to campground page
		var name = 	req.body.name;
		var image = req.body.image;
		var	desc =  req.body.description;
		var author = {
			id: req.user._id,
			username : req.user.username
		};
		var newCampground = {name:name, image:image, description:desc, author: author};
		
		// Create a new campground and save to database	
		Campground.create(newCampground, function(err, newlyCreated){
			if(err){
				console.log(err);
			}else{
				res.redirect("/");
			}
		});
		// campgrounds.push({name:name, image:image});
		// res.redirect("")
}); 


//SHOW ROUTE
router.get("/:id", function(req, res){
	//find the campground with provided ID and show template with that campground
	Campground.findById(req.params.id).populate("comments").exec( function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			console.log(foundCampground);

			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
	
});

//EDIT CAMPGROUND ROUTE

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});

});

//UPDATE CAMPGROUND ROUTE

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			console.log(err);
			res.redirect("/campground");
		}else{
			res.redirect("/campgrounds/" + req.params.id); 
		}
	})
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds");   
		}
	});
});


//middleware
// function isLoggedIn(req, res, next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	} else {
// 		res.redirect("/login");
// 	}
// }

//middleware
// function checkCampgroundOwnership  (req, res, next){
// 		if(req.isAuthenticated()){
		
// 			Campground.findById(req.params.id, function(err, foundCampground){
// 				if(err){
// 					res.redirect("back");
// 				} else {
// 					//does the user own the campgrounds
// 					if(foundCampground.author.id.equals(req.user._id)){
// 						next();
// 					}else{
// 						res.redirect("back");
// 					}
						
// 				}
// 		});
// 	}else{
// 		res.redirect("back");
// 	}
// }



module.exports = router;