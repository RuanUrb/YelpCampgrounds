const Campground = require('../models/campground')

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
}

module.exports.renderNewForm = (req, res)=>{
	res.render('campgrounds/new')
}

module.exports.createCampground = async(req, res, next)=>{
    const c = new Campground(req.body.campground)
    c.author = req.user.id
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
	const {id} = req.params
	const campground = await Campground.findById(id)
	const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground})
	req.flash('success', 'Successfully update the campground.')
	res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground = async (req, res, next)=>{
	const {id} = req.params
	await Campground.findByIdAndDelete(id)
	req.flash('success', 'Successfully deleted campground.')

	res.redirect('/campgrounds')
}