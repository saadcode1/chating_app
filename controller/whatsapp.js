const mongoose = require("mongoose");
const User=require("../models/user");
const Conversation=require("../models/conversation.js");
const Message=require("../models/message..js")

module.exports.whatsapp=async (req,res)=>{;
     let userData=await User.find({});
     res.render("whatsapp.ejs",{userData});
}

module.exports.chats = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const user = await User.findById(receiverId);
    const userData = await User.find({});
    const senderId = req.user._id;

    // Find an existing conversation between the two users
    let conversations = await Conversation.find({ member: { $all: [senderId, receiverId] } });
    let matchedConversation = conversations.reduce((acc, conversation) => {
      if (conversation.member.includes(senderId)) {
        return conversation;
      }
      return acc;
    }, null);

    if (!matchedConversation) {
      console.log("running");
      const newConversation = new Conversation({
        member: [senderId, receiverId]
      });
      await newConversation.save();
      matchedConversation = newConversation; // Assign the new conversation to matchedConversation
    }

    res.locals.conversationId = matchedConversation._id;
    console.log(res.locals.conversationId);
    let msgRes = await Message.find({ conversationId: matchedConversation._id });
    console.log(msgRes);
    res.render("whatsapp1.ejs", { user, userData, msgRes });
  } catch (err) {
    console.error("Error while inserting data into mongoose:", err.message);
  }
};




module.exports.chatings = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.id;
    let textVal = req.body.text;

    // Find the existing conversation between the two users
    let conversation = await Conversation.findOne({
      $or: [
          { member: [receiverId, senderId] },
          { member: [senderId, receiverId] }
      ]
  });

    if (!conversation) {
      // If no conversation exists, create a new one
      conversation = await Conversation.create({ member: [receiverId, senderId] });
      let message = {
        conversationId: conversation._id,
        senderId: senderId,
        recieverId: receiverId,
        text: textVal
      };
      let messageData = new Message(message);
      await messageData.save();
    }

    let message = {
      conversationId: conversation._id,
      senderId: senderId,
      recieverId: receiverId,
      text: textVal
    };
    let messageData = new Message(message);
    await messageData.save();
    res.redirect(`/whatsapp/${receiverId}`);
  } catch (err) {
    console.log("error while operation with mongo!",err.message);
  }
};