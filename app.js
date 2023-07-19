const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const morgan = require('morgan')
const ExpressError = require('./utils/ExpressError.js')
const session = require('express-session')
const flash = require('connect-flash')

const campgrounds = require('./routes/campground.js')
const reviews = require('./routes/review.js')


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
app.use(express.static(path.join(__dirname, 'public'))) // links express to public resource folder
app.use(flash())

// session configuration cookie
const sessionConfig = {
	secret: 'secrettohideyourpowerlevel',
	resave: false,
	saveUninitialized: true,
	cookie: {
		maxAge: 1000*60*60*24*7, // expires in a week
		httpOnly: true 
	}
}

app.use(session(sessionConfig))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use((req, res, next)=>{
	//creates local variables within Express to render flash messages
	res.locals.success = req.flash('success')
	res.locals.error = req.flash('error')
	next() 
})

app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)


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
