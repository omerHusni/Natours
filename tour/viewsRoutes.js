const express = require('express');
const {
  overview,
  getTour,
  getLoginFrom,
  getSignUpFrom,
  getAccount,
  updateUserData,
  getMytours,
} = require('../controllers/viewsController');
const { isLoggedIn, protect } = require('../controllers/authController');
const { createBookingCheckout } = require('../controllers/bookingController');

const router = express.Router();

router.get('/me', protect, getAccount);

router.use(isLoggedIn);

router.get('/', createBookingCheckout, overview);

router.get('/tour/:slug', getTour);

router.get('/login', getLoginFrom);

router.get('/signup', getSignUpFrom);

router.post('/submit-user-data', protect, updateUserData);

router.get('/my-tours', protect, getMytours);

module.exports = router;
