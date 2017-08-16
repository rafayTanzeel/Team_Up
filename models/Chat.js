const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  name: String,
  image: String,
  message: String,
  date: Date,
  roomId: String,
});

module.exports = mongoose.model('Chat', ChatSchema);
