'use strict';

import mongoose from 'mongoose';

var MessageSchema = new mongoose.Schema({
  name: String,
  room_name: String,
  user_id: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Message', MessageSchema);
