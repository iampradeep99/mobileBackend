const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    name: { type: String },
    avatar: { type: String },
    status: { type: String, default: 'Hey there! I am using ChatApp.' },
    chats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }],
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },
  },
  { timestamps: true }
);



module.exports = mongoose.model('User', userSchema);
