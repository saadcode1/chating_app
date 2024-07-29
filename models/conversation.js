const express=require("express");
const mongoose=require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');
const Schema=mongoose.Schema;

const conversationSchema=new Schema({
    member:[{
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }],
    message:{
        type:String,
    }},
    {
       timestamps:true,
    }
)

module.exports=mongoose.model("Conversation",conversationSchema);