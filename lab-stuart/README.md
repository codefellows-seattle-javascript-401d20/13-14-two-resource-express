## Object Relational Mapping - Lab Stuart

## About
This is a REST API for tracking sandwich recipies.

## Setup
First set Environment Variables
* `export PORT=8000`
* `export MONGODB_URI=mongodb://localhost/dev`

To start the database and server run the following command `npm run dbon && npm run start`.  

To stop the database run `npm run dboff`.

## API
- The API supports a One to Many relationship between a Menu and Sandwiches.
- One Menu can have multiple Sandwiches
- A Sandwich can belong to just one Menu

## Routes

#### /api/menus
- POST: requires a `title`, else 400

#### /api/menus/:id
- GET: requires a valid `id`, returns a menu object, else 404
- PUT: requires a valid `id`, updates a menu object, else 404
- DELETE: requires a valid `id`, deletes a menu object, else 404

* * *

#### /api/sandwiches
- POST: requires a `title` and `bread`, else 400

#### /api/sandwiches/:id
- GET: requires a valid `id`, returns a sandwich object, else 404
