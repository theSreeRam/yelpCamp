var express 	= require("express");
var app		    = express();
var bodyParser  = require("body-parser");
var mongoose    = require("mongoose");
var Comment 	= require("./models/comment"),
	passport 	= require("passport"),
	LocalStrategy = require("passport-local"),
	User 		= require("./models/user"),
	methodOverride= require("method-override");

const flash = require("connect-flash"); 

var Campground = require("./models/campground"),
	seedDB = require("./seeds");

var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index");

mongoose.connect('mongodb+srv://sreeram:1234@cluster0.6ocqu.mongodb.net/<dbname>?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(()=> {
	console.log("Connected to DB");
}).catch(err => {
	console.log("error: ", err.message);
});


// seedDB(); Seed the database


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.use(methodOverride("_method"));

app.use(express.static(__dirname + "/public"));


app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Once again Rusty wins cutest dog!",
	resave: false,
	saveUninitialized: false 
}));
 



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//pass the currentUser through every route
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");   
	res.locals.success = req.flash("success");   
	next();
});

//ROUTING 
app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);


var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});

