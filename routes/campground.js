const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync.js')
const {isLoggedIn, validateCampground, isAuthorized} = require('../middleware.js')
const campgrounds = require('../controllers/campgrounds.js')

router.get('/', campgrounds.index)

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.get('/:id', catchAsync(campgrounds.showCampground))

router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

router.get('/:id/edit', isLoggedIn, isAuthorized, catchAsync(campgrounds.editForm))

router.put('/:id', validateCampground, isLoggedIn, isAuthorized, catchAsync(campgrounds.updateCampground))

router.delete('/:id', catchAsync(campgrounds.deleteCampground))

module.exports = router