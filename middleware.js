const {campgroundSchema, reviewSchema} = require('./utils/schemas')
const ExpressError = require('./utils/ExpressError')
const Campground = require('./models/campground')
const Review = require('./models/review')

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
		req.flash('error', 'You must be signed in to do this.')
		return res.redirect('/login')
	}
    next()
}

module.exports.validateCampground = (req, res, next) => {
	const {error} = campgroundSchema.validate(req.body)
	if(error){
		const msg = error.details.map(elem => elem.message).join(', ')
		throw new ExpressError(msg, 400)
	}
	else{
		next()
	}
}

module.exports.isAuthorized = async (req, res, next) => {
	const {id} = req.params
	const campground = await Campground.findById(id)

	if(!campground.author.equals(req.user.id)){
		req.flash('error', 'You do not have permission to do this.')
		return res.redirect(`/campgrounds/${id}`)
	}
	else{
		next()
	}
}

module.exports.isReviewAuthorized = async (req, res, next) => {
	const {id, reviewId} = req.params
	const review = await Review.findById(reviewId)

	if(!review.author.equals(req.user.id)){
		req.flash('error', 'You do not have permission to do that.')
		return res.redirect(`/campgrounds/${id}`)
	}
	else{
		next()
	}
}

module.exports.validateReview = (req, res, next) => {
	const {error} = reviewSchema.validate(req.body)
	if(error){
		const msg = error.details.map(elem => elem.message).join(', ')
		throw new ExpressError(msg, 400)
	}
	else{
		next()
	}
}