var express = require('express');
var app = express();
app.use(express.static('public'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

/****  this data would really live in salido's db.  */
var salidoRestaurants = [
    { "id":"1", "name":"tasty thai", "address":"1 broadway" },
    { "id":"2", "name":"classy californian", "address":"2 mercer"}
];

function getRestaurantsFromSalidoDb() {
    return salidoRestaurants;
}
/****** end of data and accessors for salido's db */



/************** this data would be stored in your mysql database. Just check out Amazon RDS, since you are already using EC2. */
// Key is the salido restaurant id
var myLocations = {
    "1" : { "lat":Math.random(), "lon":Math.random() }
};

function getLocationsFromMyDb() {
    return myLocations;
}

function addLocationToDatabase(restaurantId, lat, lon) {
    console.log("Storing location for restaurant " + restaurantId + ": lat=" + lat + ", lon=" + lon);
    myLocations[restaurantId] = { "lat":lat, "lon":lon };
}
/*********** end of data and accessors to your db */


/*** this would be the geocode function that you used before, probably google maps but any geocode service will do */
function getLatLonForAddress(address) {
    console.log("Geocoding " + address);
    return { "lat":Math.random(), "lon":Math.random() };
}

// This is the route that your angular app will hit to get the list of restaurants.
app.get('/api/restaurants', function (req, res) {
    var restaurants = getRestaurantsFromSalidoDb();
    var locations = getLocationsFromMyDb();
    // Join restaurants with location (this is better done in SQL, but I'm choosing to do it in the app in JavaScript since you probably have more experience with this js than sql.)
    var restaurantsWithLatLon = [];
    for (var i = 0; i < restaurants.length; i++) {
        var restaurant = restaurants[i];
        var location = locations[restaurant.id];
        if (location) {
            console.log("Already have location for restaurant " + restaurant.id);
        } else {
            console.log("No location stored for restaurant " + restaurant.id);
            location = getLatLonForAddress(restaurant.address);
            addLocationToDatabase(restaurant.id, location.lat, location.lon);
        }
        restaurant.lat = location.lat;
        restaurant.lon = location.lon;
        restaurantsWithLatLon.push(restaurant);
    }

    res.send(restaurantsWithLatLon);
});


// Start the server
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});