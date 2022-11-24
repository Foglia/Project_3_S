const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    imageUrl: {
      type: String,
      default: 'images/default-avatar.png'
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
    },
    location: {
      country: String,
      city: String,
    },
    aboutMe: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

favorit: [{type: Schema.Types.ObjectId, ref:"Event"}];
// atendeeEvent: [{type: Schema.Types.ObjectId, ref:"Event"}];

const User = model("User", userSchema);
module.exports = User;
