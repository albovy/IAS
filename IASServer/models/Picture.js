const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pictureSchema = new Schema({
  // id: {
  //     type: String,
  //     required: true,
  //     unique: true
  // },
  owner_id: {
    type: String,
    required: true,
  },
  username:{
      type: String,
      required:true
  },
  description:{
      type: String,
      required: true
  },
  // BASE 64 O ENLACE A UN STATIC PATH
  public: {
    type: Boolean,
    required: false,
    default: false,
  },
  uri: {
    type: String,
    required: true,
    lowercase: true,
  },
});

module.exports = mongoose.model("Picture", pictureSchema);
