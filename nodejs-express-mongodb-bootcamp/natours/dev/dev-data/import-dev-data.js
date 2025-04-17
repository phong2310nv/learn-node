const fs = require('fs');
const Tour = require('../models/tourModel');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: '../.env' });
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('DB connection successful!'))
  .catch((err) => {
    console.error('DB connection error:', err);
  });

const tours = fs.readFileSync(`${__dirname}/data/tours.json`, 'utf-8');

const importData = async () => {
  try {
    await Tour.create(JSON.parse(tours));
    console.log('Data successfully loaded!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
