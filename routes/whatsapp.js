const express = require("express");
const router=express.Router();
const controller=require("../controller/whatsapp");
const isLoggedIn=require("../middlewares");
// requirng models


router.get("/whatsapp",isLoggedIn,controller.whatsapp);
router.get("/whatsapp/:id",isLoggedIn,controller.chats);
router.post("/whatsapp/chat/:id",isLoggedIn,controller.chatings);
module.exports=router;