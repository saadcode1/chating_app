const express = require("express");
const mongoose=require("mongoose");
const router=express.Router();
const passport=require("passport");
const LocalStrategy=require("passport-local");
const controller=require("../controller/user");
const isLoggedIn=require("../middlewares");
// requirng models
const User=require("../models/user");

router.get("/",controller.loginPage);
router.get("/signIn",controller.homePage);
router.post("/signUp",controller.signUp)
router.get("/logIn",controller.loginForm)
router.post("/loggedIn", passport.authenticate("local",{
    failureRedirect: "/logIn",
    failureFlash: true
    }), controller.loggedIn);

router.get("/loggedOut",controller.loggedOut);
  


module.exports=router;