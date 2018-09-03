let restaurants, neighborhoods, cuisines;
var markers = [];
var map;
var myLazyLoad = new LazyLoad();

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  fetchNeighborhoods();
  fetchCuisines();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
   DBHelper.fetchNeighborhoods((error, neighborhoods) => {
     if (error != null) { // Got an error
       console.error(error);
     } else {
       self.neighborhoods = neighborhoods;
       fillNeighborhoodsHTML();
     }
   });
 }

/**
 * Set neighborhoods HTML.
 */
 fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
   const select = document.getElementById('neighborhoods-select');
   neighborhoods.forEach(neighborhood => {
     const option = document.createElement('option');
     option.innerHTML = neighborhood;
     option.value = neighborhood;
     option.setAttribute('aria-label', neighborhood);
     option.setAttribute('role', 'option');
     select.append(option);
   });
 }

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
   DBHelper.fetchCuisines((error, cuisines) => {
     if (error) { // Got an error!
       console.error(error);
     } else {
       self.cuisines = cuisines;
       fillCuisinesHTML();
     }
   });
 }

/**
 * Set cuisines HTML.
 */
 fillCuisinesHTML = (cuisines = self.cuisines) => {
   const select = document.getElementById('cuisines-select');
   cuisines.forEach(cuisine => {
     const option = document.createElement('option');
     option.innerHTML = cuisine;
     option.value = cuisine;
     option.setAttribute('aria-label', cuisine);
     option.setAttribute('role', 'option');
     select.append(option);
   });
 }

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  updateRestaurants();
}

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
      myLazyLoad.update();
    }
  })
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  self.markers.forEach(marker => marker.setMap(null));
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
 fillRestaurantsHTML = (restaurants = self.restaurants) => {
   const ul = document.getElementById('restaurants-list');
   restaurants.forEach(restaurant => {
     ul.append(createRestaurantHTML(restaurant));
   });
   addMarkersToMap();
   myLazyLoad.update();
 }

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant = self.restaurants) => {
  const li = document.createElement('li');
  li.setAttribute('role', 'listitem');

  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.setAttribute('aria-label', "img_" + restaurant.id);
  image.setAttribute('role', 'img');
  const altName = restaurant.description;
  image.alt = altName;
  li.append(image);

  const name = document.createElement('h2');
  name.innerHTML = restaurant.name;
  li.append(name);

  const favoriteContainer = document.createElement('div');
  const favorite = document.createElement('span');
  favoriteContainer.setAttribute('aria-label', 'favorite heart');
  favorite.classList.add('favorite');
  if(restaurant.is_favorite) favorite.classList.add('active');
  favorite.innerHTML = '🖤';
  favorite.setAttribute('id', restaurant.id);
  favorite.setAttribute('role', 'button');
  favorite.title = (restaurant.is_favorite) ? 'Remove from Favorites' : 'Add to Favorites';
  favorite.addEventListener('click', toggleFavorite);
  favoriteContainer.append(favorite);
  li.append(favorite);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  li.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.setAttribute('aria-label', 'View restaurant details');
  more.setAttribute('role', 'button');
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(more)

  return li;
}

var imageLazyLoad = new LazyLoad({
    elements_selector: ".restaurant-img"
});

toggleFavorite = (event) => {
  const id = Number(event.target.getAttribute('id'));
  const is_favorite = !event.target.classList.contains('active');

  DBHelper.fetchFavorite(id, is_favorite)
  .then(response => {
    event.target.classList.toggle('active');
    event.target.title = (response.is_favorite) ? 'Remove from Favorites' : 'Add to Favorites';
  })
}

/**
 * Add markers for current restaurants to the map.
 */
 addMarkersToMap = (restaurants = self.restaurants) => {
   restaurants.forEach(restaurant => {
     // Add marker to the map
     const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
     google.maps.event.addListener(marker, 'click', () => {
       window.location.href = marker.url
     });
     self.markers.push(marker);
   });
 }

 /**
  * Show map after onclick event
  */
 function showMap() {
   const mp = document.getElementById("map");
   const button = document.getElementById("map-button");
   mp.style.display = "block";
   button.style.display = "none";
 }
