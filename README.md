# Heritage-Glass

Live link
https://boiling-mesa-14145.herokuapp.com/

## Overview
A Node js Web application for managing and locating the World heritage sites .
## Proposed Project 
- Features
- Secure login 
- Proper Authorization
- CRUD 
- Database connection
- Geo location
## Functionalities and Use cases
- New Users are able to sign up  and existing users are able to log in using their valid credentials.
- Only the Logged in user can add the new heritage site.
- Only the user who had added that heritage site should be able to edit that heritage site.
- Any logged in user can comment on any heritage site.
- Users are able to delete only their comments, not others.
- Heritage site should be geo located on The map


## Implementation
It's a node js web application. So javascript and ejs , HTML and CSS are primarily used for the implementation. It uses MVC (Model View Controller) design paradigm for the easy code structure and visibility.


## Tech stack
- MongoDB   : No Sql database for data and session storage
- Express js: The backend Framework
- Node js : Javascript framework

## Npm packages used:
- Ejs: for Embedding javascript in the HTML 
- Mongoose: object modeling tool for MongoDB
- Joi: for Schema and data validation
- Passport js: Express compatible authentication middleware.
- Connect flash: for displaying one time messages
- Dotenv: for loading environment variable from .env file to process.env

## API Used:
- MapBox:   
The free version of this robust API is used  for the Geo locating the Heritage Sites on the Map.
It uses the Geo jason format for the coordinates. Web application makes use of both forward and backward geoCoding to locate the  site on the map.

## Learning Outcomes
 Learned about the databases and how to integrate them in backend 
 Implemented authentication and authorization 
 Worked with Mapbox API to add the location feature 


