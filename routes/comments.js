var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware")

//====================================================//
//	COMMENTS ROUTE//
//====================================================//

//comments new
router.get("/new", middleware.isLoggedIn,  function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new", {campground : campground});
		}
	})
});

//comments create
router.post("/", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			// console.log(req.body.comment);
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "Somethign Went Wrong");
					console.log(err);
				} else {
					//add username and id to the comments
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save the comment
					comment.save();
					
					//add the comment to campground
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Succesfully added comment");
					res.redirect("/campgrounds/" + campground._id);
				}
				
			});
		}
	});
});

//COMMENTS EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership,function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		} else {
				res.render("comments/edit", {campground_id : req.params.id, comment : foundComment});
		}
	})
});

//COMMENTS UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

//COMMENTS DESTROY ROUTE

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success", "Comment Deleted");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

//middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect("/login");
	}
}

//middleware
// function checkCommentOwnership(req, res, next){
// 		if(req.isAuthenticated()){
		
// 			Comment.findById(req.params.comment_id, function(err, foundComment){
// 				if(err){
// 					res.redirect("back");
// 				} else {
// 					//does the user own the campgrounds
// 					if(foundComment.author.id.equals(req.user._id)){
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