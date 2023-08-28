const mongoose = require('mongoose')
const Campground = require('../models/campground.js')
const citiesArray = require('./cities.js')
const {first, second} = require('./seedHelpers.js')

mongoose.connect('mongodb://localhost:27017/yelpCamp', {
	useNewUrlParser: true})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'somethings gone wrong.'))
db.once('open', ()=>{
	console.log('Database has been connected.')
})

const sample = array => array[Math.floor(Math.random()*array.length)]

const seedDB = async () => {
    await Campground.deleteMany({}) //deletes everything
    for(let i = 0; i < 50; i++){
        const random = Math.floor(Math.random()*1000)
        const price = Math.floor(Math.random()*20) + 10
        const c = new Campground(
            {
            author: '64bad2062ad11f0c6e8f0f7a',
            location: `${citiesArray[random].city} - ${citiesArray[random].state}`,
            title: `${sample(first)}  ${sample(second)}`,
            description: 'No description for the time being',
            price,
            images: [
                {url: 'https://res.cloudinary.com/dlwh01eif/image/upload/v1690397745/kpp7ngnaqnmyuipdvtmn.png',
                filename: 'kpp7ngnaqnmyuipdvtmn'}
            ]
            
    })
        await c.save()
    }
}

seedDB().then(()=>{
    console.log("everything okay.")
    mongoose.connection.close()
})