const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
  username: String,
  password: String,
  location: String,
  contact: Number
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
