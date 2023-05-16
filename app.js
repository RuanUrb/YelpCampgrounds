const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const Campground = require('./models/campground.js')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const morgan = require('morgan')

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

app.listen(5500, ()=>{
	console.log("Open...")
})

app.get('/campgrounds', async (req, res) => {
	const campgrounds = await Campground.find({})
	res.render('campgrounds/index', {campgrounds})
})

app.get('/campgrounds/new', (req, res)=>{
	res.render('campgrounds/new')
})

app.get('/campgrounds/:id', async (req, res)=>{
	const {id} = req.params
	const campground = await Campground.findById(id)
	res.render('campgrounds/show', {campground})
})

app.post('/campgrounds', async (req, res)=>{
	const c = new Campground(req.body.campground)
	await c.save()
	res.redirect(`/campgrounds/${c._id}`)
})

app.get('/campgrounds/:id/edit', async (req, res)=>{
	const {id} = req.params
	const campground = await Campground.findById(id)
	res.render('campgrounds/edit', {campground})
})

app.put('/campgrounds/:id', async (req, res)=>{
	const {id} = req.params
	const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
	res.redirect(`/campgrounds/${id}`)
})

app.delete('/campgrounds/:id', async (req, res)=>{
	const {id} = req.params
	await Campground.findByIdAndDelete(id)
	res.redirect('/campgrounds')
})
