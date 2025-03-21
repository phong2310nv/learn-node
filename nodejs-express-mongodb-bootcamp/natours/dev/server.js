const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();
const app = require('./app');
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
