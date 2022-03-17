const express = require('express');
const {
  createReview,
  setGetTourReview,
  deleteReview,
  getAllReviews,
  getReview,
  updateReview,
  setTourUserIds,
} = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });
//                             used to allow a route to access another route

router.use(authController.protect);
router
  .route('/')
  .get(setGetTourReview, getAllReviews)
  .post(authController.restrictTo('user'), setTourUserIds, createReview);

router
  .route('/:id')
  .get(getReview)
  .patch(authController.restrictTo('user', 'admin'), updateReview)
  .delete(authController.restrictTo('user', 'admin'), deleteReview);
module.exports = router;
