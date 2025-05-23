const Review = require('../models/reviewModel');
const APIFeature = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handleFactory');

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

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createReview = factory.createOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.getReview = factory.getOne(Review);

exports.deleteReview = factory.deleteOne(Review);
