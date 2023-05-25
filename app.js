const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const Campground = require('./models/campground.js')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const morgan = require('morgan')
const catchAsync = require('./utils/catchAsync.js')
const ExpressError = require('./utils/ExpressError.js')
const {campgroundSchema} = require('./utils/schemas.js')


mongoose.connect('mongodb://localhost:27017/yelpCamp', {
	useNewUrlParser: true})


const db = mongoose.connection
db.on('error', console.error.bind(console, 'somethings gone wrong.'))
db.once('open', ()=>{
	console.log('Database has been connected.')
})



app.engine('ejs', ejsMate)
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(morgan('tiny'))



app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


// JOI backend validation

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

app.get('/campgrounds', async (req, res) => {
	const campgrounds = await Campground.find({})
	res.render('campgrounds/index', {campgrounds})
})

app.get('/campgrounds/new', (req, res)=>{
	res.render('campgrounds/new')
})

app.get('/campgrounds/:id', catchAsync(async (req, res, next)=>{
	const {id} = req.params
	const campground = await Campground.findById(id)
	res.render('campgrounds/show', {campground})
}))



app.post('/campgrounds', validateCampground, catchAsync(async(req, res, next)=>{
		const c = new Campground(req.body.campground)
		await c.save()
		res.redirect(`/campgrounds/${c._id}`)
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res, next)=>{
	const {id} = req.params
	const campground = await Campground.findById(id)
	res.render('campgrounds/edit', {campground})
}))

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res, next)=>{
	const {id} = req.params
	const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
	res.redirect(`/campgrounds/${id}`)
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res, next)=>{
	const {id} = req.params
	await Campground.findByIdAndDelete(id)
	res.redirect('/campgrounds')
}))

app.all('*', (req, res, next) => {
	next(new ExpressError('Page not found!', 404))
})

// Error handling middleware
app.use((err, req, res, next) => {
	const {statusCode = 500} = err
	if(!err.message) err.message = 'Something went wrong.' 
	res.status(statusCode).render('error.ejs', {err})
})

app.listen(5500, ()=>{
	console.log("Open...")
})
