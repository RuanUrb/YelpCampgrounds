const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema

const ImageSchema = new Schema({
    url: String,
    filename: String
})

// Uses virtual property to image schema that replaces image URL with its 200x200 thumbnail counterpart 
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200')
})

const options = {toJSON: {virtuals: true}} // this is needed due to virtuals not naturally being rendered when campground is JSON-stringified.

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,

    //geometry should be declared as following due to mongoDB geospatial APIs compatibility
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    location: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, options)

CampgroundSchema.virtual('properties.popUp').get(function(){
    return `<strong><a href="/campgrounds/${this.id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 30)}...</p>`
})

CampgroundSchema.post('findOneAndDelete', async function (doc){ // middleware to delete all reviews associated to the deleted campground
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})


module.exports = mongoose.model('Campground', CampgroundSchema)