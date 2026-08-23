const mongoose = require("mongoose");
const plm = require("passport-local-mongoose").default;

mongoose.connect ("mongodb://127.0.0.1:27017/pinterestdb");

const userschema = mongoose.Schema({
  username: String,
  name:String,
  email: String,
  contact: Number,
  password : String,
  image:String,
  dob:{
    type: Date,
    default:Date.now()
  },
  boards:{
    type: Array,
    default: []
  },
  post: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
      }
    ],
    default: []
  }
});

userschema.plugin(plm);

module.exports = mongoose.model("login" , userschema);