var express = require('express');
var router = express.Router();
const usermodel = require("./users");
const postmodel = require("./post");
const passport = require('passport');
const localStrategy = require("passport-local");
const upload = require('./multer');

passport.use(new localStrategy(usermodel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


router.get("/profile", isLoggedIn, async function(req,res){
  const user = 
  await usermodel
        .findOne({username: req.session.passport.user})
        .populate("post")
  res.render('profile', {user});
});

router.get("/feed", isLoggedIn, async function(req,res){
  const user = await usermodel.findOne({username: req.session.passport.user});
  const posts =  await postmodel.find()
  .populate("user")

  res.render('feed', {user ,posts});
});

router.get("/add", isLoggedIn, async function(req,res){
  const user =  await usermodel.findOne({username: req.session.passport.user});
  res.render('add' , {user});
});

router.post("/createpost", isLoggedIn,upload.single("postimage") , async function(req,res){
  const user =  await usermodel.findOne({username: req.session.passport.user});
  const post =  await postmodel.create({
    user:user._id,
    title: req.body.title,
    discription: req.body.discription,
    image: req.file.filename
  });

  user.post.push(post._id);
  await user.save();
  res.redirect("/profile");
});

router.post("/fileupload", isLoggedIn, upload.single("image"), async function(req,res,next){
  const user =  await usermodel.findOne({username: req.session.passport.user});
  user.image = req.file.filename;
  await user.save();
  res.redirect("/profile");
});

router.post("/deletepost", isLoggedIn , async function(req,res,next){
  // const postdelete = await postmodel.findOneDelete({})
  // await post.save();
  // res.redirect("/profile");
  const { postId } = req.body;
  await postmodel.findByIdAndDelete(postId);
  res.redirect("/profile");
});

// update 
router.post('/follow' , async function(req,res,next){
  const {userId} =req.body;
    await usermodel.findByIdAndUpdate(
    userId,{$inc:{followers:1}},{new:true});
    res.redirect("/feed");
});

router.get('/about' , function(req,res){
  res.render("about");
});

router.get('/termandcondition' , function(req,res){
  res.render("termandcondition");
});

router.post('/',function(req,res){
  var userdata = new usermodel({
    username:req.body.username,
    name:req.body.name,
    email:req.body.email,
    contact:req.body.contact,
    dob:req.body.dob
  });

  usermodel.register(userdata, req.body.password)
  .then(function(registereduser){
    passport.authenticate("local")(req,res,function(){
      res.redirect('/profile');
    })
  })
});

router.post('/login',passport.authenticate("local",{
  successRedirect: '/profile',
  failureRedirect: "/"
}),function(req,res){});

router.get('/logout',function(req,res,next){
  req.logout(function(err){
    if(err) {return next(err);
    }
    res.redirect('/');
  });
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}



module.exports = router;
