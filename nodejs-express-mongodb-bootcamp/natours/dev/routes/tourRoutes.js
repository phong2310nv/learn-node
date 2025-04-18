const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewsRouter = require('../routes/reviewsRoutes');

const router = express.Router();

router.use('/:tourId/reviews', reviewsRouter);

router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protected('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan,
  );

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protected('admin', 'lead-guide'),
    tourController.createTour,
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .put(
    authController.protected('admin', 'lead-guide'),
    tourController.updateTour,
  )
  .delete(
    authController.protected('admin', 'lead-guide'),
    tourController.deleteTour,
  );

module.exports = router;
