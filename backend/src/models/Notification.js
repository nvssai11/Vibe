import mongoose from "mongoose";

const { Schema } = mongoose;

const notificationSchema = new Schema({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  type: { 
    type: String, 
    required: true,
    enum: ['message', 'event', 'resource'] 
  },
  message: { 
    type: String, 
    required: true 
  },
  relatedItem: { 
    type: Schema.Types.ObjectId, 
    required: true 
  },
  read: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model("Notification", notificationSchema);