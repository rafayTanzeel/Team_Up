const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const autoIncrement = require('mongoose-auto-increment');

const db = mongoose.connection;
autoIncrement.initialize(db);

const UserSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  displayName: String,
  email: String,
  password: String,
  image: String,
  status: String,
  facebook: Object,
  twitter: Object,
  google: Object,
  identification: Number,
});

UserSchema.virtual('userId')
  .get(function() {
    const user = this;
    return user.firstname + '_' + user.lastname + user.identification;
});


UserSchema.pre('save', function(next) {
  const user = this;
  const saltRound = 10;

  if (!user.isModified('password')) return next();

  if (user.password) {
    bcrypt.hash(user.password, saltRound, (err, hash) => {
      if (err) {
        throw err;
        // return next(err);
      }
      user.password = hash;
      next();
    });
  }
});

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};


UserSchema.plugin(autoIncrement.plugin, {model: 'User', field: 'identification', startAt: 1});
module.exports = mongoose.model('User', UserSchema);
