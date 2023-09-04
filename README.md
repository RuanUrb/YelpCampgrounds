# YelpCampgrounds
This is a functional NodeJS full-stack web app built along Colt Steele's web development course.

Built on a MongoDB/Express/Node stack along with Bootstrap CSS framework for stylization. Features MVC RESTful architecture.

### Homepage:
<p align="center"><img src="https://res.cloudinary.com/dlwh01eif/image/upload/v1693866281/homepage_vmuatb.png" alt="Campground"></p>

# [Live Access](https://yelpcamp-campgrounds.onrender.com/)

## Features
* Browse through lots of campgrounds and find them by location
* Users can create, edit, and remove campgrounds
* Users can post, edit and delete reviews

## Built With

- [Node.js](https://nodejs.org) - Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
- [Express](https://expressjs.com//) - Fast, unopinionated, minimalist web framework for Node.js
- [MongoDB](https://www.mongodb.com/) - The database for
  modern applications
- [Mongoose](https://mongoosejs.com/) - Elegant MongoDB object modeling for Node.js
- [EJS](https://ejs.co/) - Embedded JavaScript templating
- [Bootstrap](https://getbootstrap.com/) - Powerful, extensible, and feature-packed frontend toolkit.

## Run it locally
1. Install [mongodb](https://www.mongodb.com/)
2. Create a cloudinary account to get an API key and secret code
3. Register to Mapbox to get your free token.
4. You can optionally choose to store data remotely by registering to MongoDB Atlas. In this case, you won't need to install Mongo locally.
```
git clone https://github.com/RuanUrb/YelpCampgrounds.git
cd YelpCampgrounds
npm install
```
Create a .env file in the project root directory and add the following variables:
```
CLOUD_URL='<url>'
CLOUDINARY_API_KEY='<key>'
CLOUDINARY_API_SECRET='<secret>'
CLOUDINARY_API_KEY='<secret>'
MAPBOX_TOKEN='<token>'
SESSION_SECRET='<secret>'
```
You should have ```mongod``` running in a separate terminal, then go ```node app.js```.

Finally, go to [localhost:5500](http://localhost:5500/).

