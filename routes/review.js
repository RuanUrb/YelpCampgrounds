const express = require('express')
const router = express.Router({mergeParams: true}) // merges request parameters across files (routers and app)
const Campground = require('../models/campground.js')
const Review = require('../models/review.js')
const catchAsync = require('../utils/catchAsync')
const {validateReview, isLoggedIn, isReviewAuthorized} = require('../middleware.js')

router.post('/', validateReview, isLoggedIn, catchAsync(async(req, res)=>{
	const campground = await Campground.findById(req.params.id)
	const review = new Review(req.body.review)
	review.author = req.user.id
	campground.reviews.push(review)
	await review.save()
	await campground.save()
	req.flash('success', 'Successfully uploaded review.')
	res.redirect(`/campgrounds/${campground.id}`)
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthorized, catchAsync(async(req, res)=>{
	const {id, reviewId} = req.params
	await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}) 
	await Review.findByIdAndDelete(reviewId)
	req.flash('success', 'Successfully deleted review.')
	res.redirect(`/campgrounds/${id}`)

}))

module.exports = router