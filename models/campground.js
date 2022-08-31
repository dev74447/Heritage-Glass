const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require('./review')

const CampgroundSchema = new Schema({
  title: String,
  description: String,
  location: String,
  date_inscribed: Number,
  danger: Number,
  area: Number,
  category: String,
  category_code: String,
  Country: String,
  region: String,
  iso_code: String,
  img: String,
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

// this middle ware is fr the situation when a campground is deleted,
// then all the reviews which are associated with that campground are alse deletes
CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
