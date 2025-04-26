const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,

    image:{
        type:String,
        default:"https://m.media-amazon.com/images/I/41MkhtF1UfL.jpg",
        set:(v) => v ===""? "https://m.media-amazon.com/images/I/41MkhtF1UfL.jpg": v,
    },

    price: Number,
    location:String,
    country:String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;