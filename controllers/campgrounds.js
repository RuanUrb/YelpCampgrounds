const Campground = require('../models/campground')
const {cloudinary} = require('../cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoder = mbxGeocoding({accessToken: process.env.MAPBOX_TOKEN})

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
}

module.exports.renderNewForm = (req, res)=>{
	res.render('campgrounds/new')
}

module.exports.createCampground = async(req, res, next)=>{
	const geoData = await geocoder.forwardGeocode({
		query: req.body.campground.location,
		limit: 1
	}).send()
	const c = new Campground(req.body.campground)
	c.images = req.files.map(f=>({url: f.path, filename: f.filename}))
    c.author = req.user.id
	c.geometry = geoData.body.features[0].geometry
    await c.save()
    req.flash('success', 'Successfully created a campground.')
    res.redirect(`/campgrounds/${c._id}`)
}

module.exports.showCampground = async (req, res, next)=>{
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
}

module.exports.editForm = async (req, res, next)=>{
	const {id} = req.params
	const campground = await Campground.findById(id)
	if(!campground){
		res.flash('error', 'Could not found that campground!')
		return res.redirect('/campgrounds')
	}
	res.render('campgrounds/edit', {campground})
}

module.exports.updateCampground = async (req, res, next)=>{
	console.log(req.body, req.files)
	const {id} = req.params
	const campground = await Campground.findById(id)
	const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground})
	const imgs = req.files.map(f=>({url: f.path, filename: f.filename}))
	campground.images.push(...imgs)
	if(req.body.deleteImages){
		for(let filename of req.body.deleteImages){
			await cloudinary.uploader.destroy(filename)
		}
		await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
	}
	await campground.save()
	req.flash('success', 'Successfully update the campground.')
	res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground = async (req, res, next)=>{
	const {id} = req.params
	await Campground.findByIdAndDelete(id)
	req.flash('success', 'Successfully deleted campground.')

	res.redirect('/campgrounds')
}