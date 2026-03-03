import mongoose from "mongoose";
import Message from "../models/Message.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

export const sendMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    
    // Validate recipientId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(recipientId)) {
      return res.status(400).json({ message: "Invalid recipient ID format" });
    }
    
    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // Create new message
    const message = await Message.create({
      sender: req.user.id,
      recipient: recipientId,
      content,
      read: false
    });

    // Create notification for recipient
    await Notification.create({
      user: recipientId,
      type: 'message',
      message: `New message from ${req.user.name}`,
      relatedItem: message._id,
      read: false
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get messages between current user and specified user
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, recipient: userId },
        { sender: userId, recipient: req.user.id }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ message: "Invalid message ID format" });
    }

    const message = await Message.findByIdAndUpdate(
      messageId,
      { read: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json(message);
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ 
      message: "Failed to mark message as read",
      error: error.message 
    });
  }
};

export const getConversations = async (req, res) => {
  try {
    // Validate current user ID
    if (!req.user?._id || !mongoose.Types.ObjectId.isValid(req.user._id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    
    // Get all unique users the current user has messaged with
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(req.user._id) },
            { recipient: new mongoose.Types.ObjectId(req.user._id) }
          ]
        }
      },
      {
        $project: {
          otherUser: {
            $cond: [
              { $eq: ["$sender", new mongoose.Types.ObjectId(req.user._id)] },
              "$recipient",
              "$sender"
            ]
          },
          lastMessage: "$$ROOT",
          createdAt: 1
        }
      },
      {
        $group: {
          _id: "$otherUser",
          lastMessage: { $last: "$lastMessage" },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [
                  { $eq: ["$lastMessage.recipient", new mongoose.Types.ObjectId(req.user._id)] },
                  { $eq: ["$lastMessage.read", false] }
                ]},
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
          pipeline: [
            { $project: { name: 1, avatar: 1 } }
          ]
        }
      },
      {
        $unwind: "$user"
      },
      {
        $sort: { "lastMessage.createdAt": -1 }
      }
    ]);

    // Format response to match frontend expectations
    const formattedConversations = conversations.map(conv => ({
      id: conv._id.toString(),
      name: conv.user?.name || 'Unknown User',
      lastMessage: conv.lastMessage?.content || '',
      unread: conv.unreadCount > 0,
      timestamp: conv.lastMessage?.createdAt?.getTime() || Date.now()
    }));

    res.status(200).json(formattedConversations);
  } catch (error) {
    console.error('Error in getConversations:', error);
    res.status(500).json({ 
      message: "Failed to load conversations",
      error: error.message 
    });
  }
};