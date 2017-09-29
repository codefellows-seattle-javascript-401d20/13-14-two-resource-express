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

#### /api/menus
#### /api/menus/:id
- Supports GET, POST, PUT, and DELETE methods

#### /api/sandwiches
#### /api/sandwiches/:id
- Supports GET, and POST methods