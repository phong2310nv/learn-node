const mongoose = require("mongoose");
const MONGO_URL =
  "mongodb+srv://nasa-api:5TzwpIA9OEZQTELO@learnnode.qioivt5.mongodb.net/nasa-project?retryWrites=true&w=majority&appName=nasa";
mongoose.connection.once("open", () => {
  console.log("MongoDb connection ready !");
});
mongoose.connection.on("error", (err) => {
  console.error(err);
});
async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
