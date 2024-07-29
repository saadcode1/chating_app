const express=require("express");
const mongoose=require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');
const Schema=mongoose.Schema;

const messageSchema=new Schema({
    conversationId:{
        type: Schema.Types.ObjectId, ref: 'Conversation'
    },
    senderId:{
        type:String,
    },
    recieverId:{
        type:String
    },
    text:{
        type:String
    }
},
    {
       timestamps:true,
    }
)

module.exports=mongoose.model("Message",messageSchema);