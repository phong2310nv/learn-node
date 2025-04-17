const express = require('express');
const reviewController = require('../controllers/reviewController');
const router = express.Router({ mergeParams: true });
const authController = require('../controllers/authController');

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(authController.protected(), reviewController.createReview);

module.exports = router;
