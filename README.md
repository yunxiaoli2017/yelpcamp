# YelpCamp

A Yelp style website for campgrounds that supports user authentication, posting campsites/comments, and editing previous submissions.

To see the app in action, go to [https://yelp-camp-by-yunxiao.herokuapp.com/](https://yelp-camp-by-yunxiao.herokuapp.com/)

### Framework & Database

* [Node.js](https://nodejs.org/en/)
* [Express](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/)
* [Mongoose](http://mongoosejs.com/)

### Features

* Authentication & Authorization:
  
  * User login with username and password

  * One cannot manage posts and view user profile without being authenticated

  * One cannot edit or delete posts and comments created by other users
  
  * Built with [passport](http://www.passportjs.org/), [passport-local](https://github.com/jaredhanson/passport-local#passport-local), [express-session](https://github.com/expressjs/session#express-session)

* Manage campground posts with basic functionalities:

  * Create, edit and delete posts and comments
  
  * Display createdAt time info for posts and comments

  * Upload campground photos (saved to Cloudinary)

  * Display campground location with Google Maps 
  
  * Search existing campgrounds
  
  * Built with [moment](https://momentjs.com/), [cloudinary](https://cloudinary.com/), [multer](https://www.npmjs.com/package/multer), [Google Maps APIs](https://developers.google.com/maps/), [geocoder](https://github.com/wyattdanger/geocoder#geocoder)

* Manage user account with basic functionalities:

  * Password forgot/reset via email

  * Flash messages responding to user's interactions with the app
  
  * Built with [nodemailer](https://nodemailer.com/about/), [connect-flash](https://github.com/jaredhanson/connect-flash#connect-flash)

* Responsive web design and dynamic web page

  * Built with [Bootstrap](https://getbootstrap.com/), [ejs](http://ejs.co/)
  
### Platforms

* [Cloudinary](https://cloudinary.com/)
* [Heroku](https://www.heroku.com/)
* [goormide](https://ide.goorm.io/)

## License

#### [MIT](./LICENSE)
