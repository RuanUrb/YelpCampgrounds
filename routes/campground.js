const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync.js')
const {isLoggedIn, validateCampground, isAuthorized} = require('../middleware.js')
const campgrounds = require('../controllers/campgrounds.js')

// multer is express middleware that handles multipart/form-data forms (which is mostly used for uploading files)
const {storage} = require('../cloudinary')
const multer = require('multer')
const upload = multer({storage})

router.get('/', campgrounds.index)

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.get('/:id', catchAsync(campgrounds.showCampground))

router.post('/', isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))

router.get('/:id/edit', isLoggedIn, isAuthorized, catchAsync(campgrounds.editForm))

router.put('/:id', isLoggedIn, isAuthorized, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))

router.delete('/:id', catchAsync(campgrounds.deleteCampground))

module.exports = router