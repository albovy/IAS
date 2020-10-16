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
    shared_with: {
        type: Array,
        of: String,
        required: false,
        default: [],
        lowercase: true
    },
    // BASE 64 O ENLACE A UN STATIC PATH

    uri: {
        type: String,
        required: true,
        lowercase: true
    }
});


module.exports = mongoose.model("Picture", pictureSchema);