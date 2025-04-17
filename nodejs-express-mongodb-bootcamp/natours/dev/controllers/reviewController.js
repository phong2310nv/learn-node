const Review = require('../models/reviewModel');
const APIFeature = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const features = new APIFeature(Review, filter)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const data = await features;
  res.status(200).json({
    status: 'success',
    data: data,
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;
  const newReview = await Review.create({
    review: req.body.review,
    rating: req.body.rating,
    tour: req.body.tour,
    user: req.body.user,
  });
  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});
