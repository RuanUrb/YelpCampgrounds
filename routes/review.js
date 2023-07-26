const express = require('express')
const router = express.Router({mergeParams: true}) // merges request parameters across files (routers and app)
const catchAsync = require('../utils/catchAsync')
const {validateReview, isLoggedIn, isReviewAuthorized} = require('../middleware.js')
const reviews = require('../controllers/reviews')

router.post('/', validateReview, isLoggedIn, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthorized, catchAsync(reviews.deleteReview))

module.exports = router