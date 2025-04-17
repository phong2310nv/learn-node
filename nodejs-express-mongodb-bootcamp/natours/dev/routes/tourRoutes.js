const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewsRouter = require('../routes/reviewsRoutes');

const router = express.Router();

router.use('/:tourId/reviews', reviewsRouter);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/')
  .get(authController.protected(), tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .put(tourController.updateTour)
  .delete(authController.protected('admin'), tourController.deleteTour);

module.exports = router;
