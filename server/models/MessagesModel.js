import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },

  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },

  messageType: {
    type: String,
    enum: ["text", "file"],
    required: true,
  },

  // For text messages
  content: {
    type: String,
    required: function () {
      return this.messageType === "text";
    },
  },

  // For file messages
  file: {
    url: {
      type: String,
      required: function () {
        return this.messageType === "file";
      },
    },
    publicId: {
      type: String,
      required: function () {
        return this.messageType === "file";
      },
    },
    originalName: String,
    mimeType: String,
    size: Number,
  },

  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Messages", messageSchema);
export default Message;
