const mongoose = require('mongoose');
const { Schema } = mongoose;

const users = new Schema({
  // _id 부분은 기본적으로 생략. 알아서 Object.id를 넣어줌
  email: {
    type: String, 
  },
  password:{
    type: String,
  },
  name: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now, // 기본값
  },
});

module.exports = mongoose.model('users', users);