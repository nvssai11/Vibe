import mongoose from "mongoose";

const { Schema } = mongoose;

const messageSchema = new Schema({
  sender: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  recipient: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  content: { 
    type: String, 
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

export default mongoose.model("Message", messageSchema);