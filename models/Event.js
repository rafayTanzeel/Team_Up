const mongoose = require('mongoose');
let shortid = require('shortid');

const EventSchema = new mongoose.Schema({
  teamupName: String,
  from: {type: Date},
  to: {type: Date},
  sport: String,
  maxPlayers: Number,
  locationName: String,
  locationAddress: String,
  locationCoordinates: [Number],
  createdBy: {type: mongoose.Schema.ObjectId, ref: 'User'},
  aliasId: {type: String, unique: true, default: shortid.generate},
  users: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
});

EventSchema.virtual('roomId')
  .get(function() {
    return 'room-' + this.aliasId;
  });

EventSchema.virtual('urlChat')
  .get(function() {
    return '/event/chatroom/' + this.aliasId;
  });

  EventSchema.virtual('urlEdit')
  .get(function() {
    return '/event/edit/' + this.aliasId;
  });

  EventSchema.virtual('urlLeave')
  .get(function() {
    return '/event/leave/' + this.aliasId;
  });

  EventSchema.virtual('urlDelete')
  .get(function() {
    return '/event/delete/' + this.aliasId;
  });


module.exports = mongoose.model('Event', EventSchema);
