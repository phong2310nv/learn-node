const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
// const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getOverview);

router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protected(), viewsController.getAccount);

// router.get(
//   '/my-tours',
//   bookingController.createBookingCheckout,
//   authController.protect,
//   viewsController.getMyTours,
// );

router.post(
  '/submit-user-data',
  authController.protected(),
  viewsController.updateUserData,
);

module.exports = router;
