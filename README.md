This is for storing favorite beers

set your environment variables

PORT=3000
MONGODB_URI=mongodb://localhost

start your database and server

npm run dbon
node index.js

In package.json I added `--runInBand` to jest so that when testing all tests return in order.
