if(process.env.NODE_ENV !== 'production'){
	require('dotenv').config()
}

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
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user.js')
const helmet = require('helmet')

const mongoSanitize = require('express-mongo-sanitize')


const userRouters = require('./routes/user.js')
const campgroundRoutes = require('./routes/campground.js')
const reviewRoutes = require('./routes/review.js')


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
app.use(mongoSanitize())
app.use(helmet())

// helmet exceptions for content policy
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dlwh01eif/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

// session configuration cookie
const sessionConfig = {
	name: 'mc',
	secret: 'secrettohideyourpowerlevel',
	//secure: true,        [SHOULD BE ON WHEN IN PRODUCTION] 
	resave: false,
	saveUninitialized: true,
	cookie: {
		maxAge: 1000*60*60*24*7, // expires in a week
		httpOnly: true 
	}
}

app.use(session(sessionConfig))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate())) // authentaticate user locally
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use((req, res, next)=>{
	res.locals.currentUser = req.user
	//creates local variables within Express to render flash messages
	res.locals.success = req.flash('success')
	res.locals.error = req.flash('error')
	next() 
})

app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use('/', userRouters)

app.get('/', (req, res)=>{
	res.render('home')
})

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


