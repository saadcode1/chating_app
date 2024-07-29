const mongoose = require("mongoose");
module.exports=isLoggedIn=(req,res,next)=>{
    console.log(req.isAuthenticated());
    if(req.isAuthenticated){
      next()
    }
    else{
    return res.redirect("/signIn");
}
}
