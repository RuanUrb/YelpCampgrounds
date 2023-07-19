const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync.js')
const ExpressError = require('../utils/ExpressError.js')
const Campground = require('../models/campground.js')
const {campgroundSchema} = require('../utils/schemas.js')

const validateCampground = (req, res, next) => {
	const {error} = campgroundSchema.validate(req.body)
	if(error){
		const msg = error.details.map(elem => elem.message).join(', ')
		throw new ExpressError(msg, 400)
	}
	else{
		next()
	}
}

router.get('/', async (req, res) => {
	const campgrounds = await Campground.find({})
	res.render('campgrounds/index', {campgrounds})
})

router.get('/new', (req, res)=>{
	res.render('campgrounds/new')
})

router.get('/:id', catchAsync(async (req, res, next)=>{
	const {id} = req.params
	const campground = await Campground.findById(id).populate('reviews')
	if(!campground){
		req.flash('error', 'Campground could not be found.')
		return res.redirect('/campgrounds')
	}
	res.render('campgrounds/show', {campground})
}))



router.post('/', validateCampground, catchAsync(async(req, res, next)=>{
		const c = new Campground(req.body.campground)
		await c.save()
		req.flash('success', 'Successfully created a campground.')
		res.redirect(`/campgrounds/${c._id}`)
}))

router.get('/:id/edit', catchAsync(async (req, res, next)=>{
	const {id} = req.params
	const campground = await Campground.findById(id)
	res.render('campgrounds/edit', {campground})
}))

router.put('/:id', validateCampground, catchAsync(async (req, res, next)=>{
	const {id} = req.params
	const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
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