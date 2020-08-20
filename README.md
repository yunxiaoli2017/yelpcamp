# YelpCamp

> A Node.js web application project from the Udemy course - [The Web Developer Bootcamp by Colt Steele](https://www.udemy.com/the-web-developer-bootcamp/)

## Live Demo

To see the app in action, go to [https://stark-coast-89683.herokuapp.com/](https://stark-coast-89683.herokuapp.com/)

## Features

* Authentication & Authorization:
  
  * User login with username and password

  * One cannot manage posts and view user profile without being authenticated

  * One cannot edit or delete posts and comments created by other users
  
  * Built with [moment](https://momentjs.com/), [passport](http://www.passportjs.org/), [passport-local](https://github.com/jaredhanson/passport-local#passport-local), [express-session](https://github.com/expressjs/session#express-session)

* Manage campground posts with basic functionalities:

  * Create, edit and delete posts and comments
  
  * Display createdAt info for posts and comments

  * Upload campground photos (saved to Cloudinary)

  * Display campground location on Google Maps 
  
  * Search existing campgrounds
  
  * Built with [cloudinary](https://cloudinary.com/), [Google Maps APIs](https://developers.google.com/maps/), [geocoder](https://github.com/wyattdanger/geocoder#geocoder)

* Manage user account with basic functionalities:

  * Password reset via email
  
  * Built with [nodemailer](https://nodemailer.com/about/)

* Flash messages responding to user's interactions with the app
  
  * Built with [connect-flash](https://github.com/jaredhanson/connect-flash#connect-flash)

* Responsive web design and dynamic web page

  * Built with [Bootstrap](https://getbootstrap.com/), [ejs](http://ejs.co/)


### Framework

* [express](https://expressjs.com/)

### Database

* [mongoDB](https://www.mongodb.com/)
* [mongoose](http://mongoosejs.com/)

### Platforms

* [Cloudinary](https://cloudinary.com/)
* [Heroku](https://www.heroku.com/)
* [goormide](https://ide.goorm.io/)

## License

#### [MIT](./LICENSE)
