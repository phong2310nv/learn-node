import mongoose from "mongoose";

function generateUser() {
  const User = mongoose.model("User");
  return new User({
    googleId: `Fake: ${Date.now()}`,
    displayName: `Hello: ${Date.now()}`,
  }).save();
}
export default generateUser;
