const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT REJECTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('DB connection successful!'))
  .catch((err) => {
    console.error('DB connection error:', err);
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
