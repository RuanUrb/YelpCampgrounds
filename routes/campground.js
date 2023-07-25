const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync.js')
const Campground = require('../models/campground.js')
const {isLoggedIn, validateCampground, isAuthorized} = require('../middleware.js')

router.get('/', async (req, res) => {
	const campgrounds = await Campground.find({})
	res.render('campgrounds/index', {campgrounds})
})

router.get('/new', isLoggedIn, (req, res)=>{
	res.render('campgrounds/new')
})

router.get('/:id', catchAsync(async (req, res, next)=>{
	const {id} = req.params
	const campground = await Campground.findById(id).populate({ // populates athor of reviews
		path: 'reviews',
		populate: {
			path: 'author'
		}
	}).populate('author') // populate author of campgrounds
	if(!campground){
		req.flash('error', 'Campground could not be found.')
		return res.redirect('/campgrounds')
	}
	res.render('campgrounds/show', {campground})
}))



router.post('/', isLoggedIn, validateCampground, catchAsync(async(req, res, next)=>{
		const c = new Campground(req.body.campground)
		c.author = req.user.id
		await c.save()
		req.flash('success', 'Successfully created a campground.')
		res.redirect(`/campgrounds/${c._id}`)
}))

router.get('/:id/edit', isLoggedIn, isAuthorized, catchAsync(async (req, res, next)=>{
	const {id} = req.params
	const campground = await Campground.findById(id)
	if(!campground){
		res.flash('error', 'Could not found that campground!')
		return res.redirect('/campgrounds')
	}
	res.render('campgrounds/edit', {campground})
}))

router.put('/:id', validateCampground, isLoggedIn, isAuthorized, catchAsync(async (req, res, next)=>{
	const {id} = req.params
	const campground = await Campground.findById(id)
	const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground})
	req.flash('success', 'Successfully update the campground.')
	res.redirect(`/campgrounds/${id}`)
}))

router.delete('/:id', catchAsync(async (req, res, next)=>{
	const {id} = req.params
	await Campground.findByIdAndDelete(id)
	req.flash('success', 'Successfully deleted campground.')

	res.redirect('/campgrounds')
}))

module.exports = router