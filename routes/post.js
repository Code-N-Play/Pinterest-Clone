const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"login"
  },
  title:String,
  discription: String,
  image:String,
  like:{
    type:Number,
    default:0
  },
  dislike:{
    type:Number,
    default:0
  }
});


module.exports = mongoose.model("post" , postSchema);