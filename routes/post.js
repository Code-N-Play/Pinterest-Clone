const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId, 
    ref : 'login'
  },
  title:String,
  discription: String,
  image:String,
  likes:[{type:mongoose.Schema.Types.ObjectId , ref:'login'}],
  dislikes:[{type:mongoose.Schema.Types.ObjectId , ref:'login'}]
});


module.exports = mongoose.model("post" , postSchema);