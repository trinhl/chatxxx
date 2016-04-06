'use strict';

import mongoose from 'mongoose';

var MessageSchema = new mongoose.Schema({
  mess: String,
  room_name: String,
  user_id: String,
  info: String,
  active: Boolean,
  user_name: String,
  email: String
});

export default mongoose.model('Message', MessageSchema);
