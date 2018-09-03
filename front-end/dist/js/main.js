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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImxldCByZXN0YXVyYW50cywgbmVpZ2hib3Job29kcywgY3Vpc2luZXM7XHJcbnZhciBtYXJrZXJzID0gW107XHJcbnZhciBtYXA7XHJcbnZhciBteUxhenlMb2FkID0gbmV3IExhenlMb2FkKCk7XHJcblxyXG4vKipcclxuICogRmV0Y2ggbmVpZ2hib3Job29kcyBhbmQgY3Vpc2luZXMgYXMgc29vbiBhcyB0aGUgcGFnZSBpcyBsb2FkZWQuXHJcbiAqL1xyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKGV2ZW50KSA9PiB7XHJcbiAgZmV0Y2hOZWlnaGJvcmhvb2RzKCk7XHJcbiAgZmV0Y2hDdWlzaW5lcygpO1xyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBGZXRjaCBhbGwgbmVpZ2hib3Job29kcyBhbmQgc2V0IHRoZWlyIEhUTUwuXHJcbiAqL1xyXG5mZXRjaE5laWdoYm9yaG9vZHMgPSAoKSA9PiB7XHJcbiAgIERCSGVscGVyLmZldGNoTmVpZ2hib3Job29kcygoZXJyb3IsIG5laWdoYm9yaG9vZHMpID0+IHtcclxuICAgICBpZiAoZXJyb3IgIT0gbnVsbCkgeyAvLyBHb3QgYW4gZXJyb3JcclxuICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgIH0gZWxzZSB7XHJcbiAgICAgICBzZWxmLm5laWdoYm9yaG9vZHMgPSBuZWlnaGJvcmhvb2RzO1xyXG4gICAgICAgZmlsbE5laWdoYm9yaG9vZHNIVE1MKCk7XHJcbiAgICAgfVxyXG4gICB9KTtcclxuIH1cclxuXHJcbi8qKlxyXG4gKiBTZXQgbmVpZ2hib3Job29kcyBIVE1MLlxyXG4gKi9cclxuIGZpbGxOZWlnaGJvcmhvb2RzSFRNTCA9IChuZWlnaGJvcmhvb2RzID0gc2VsZi5uZWlnaGJvcmhvb2RzKSA9PiB7XHJcbiAgIGNvbnN0IHNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZWlnaGJvcmhvb2RzLXNlbGVjdCcpO1xyXG4gICBuZWlnaGJvcmhvb2RzLmZvckVhY2gobmVpZ2hib3Job29kID0+IHtcclxuICAgICBjb25zdCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcclxuICAgICBvcHRpb24uaW5uZXJIVE1MID0gbmVpZ2hib3Job29kO1xyXG4gICAgIG9wdGlvbi52YWx1ZSA9IG5laWdoYm9yaG9vZDtcclxuICAgICBvcHRpb24uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgbmVpZ2hib3Job29kKTtcclxuICAgICBvcHRpb24uc2V0QXR0cmlidXRlKCdyb2xlJywgJ29wdGlvbicpO1xyXG4gICAgIHNlbGVjdC5hcHBlbmQob3B0aW9uKTtcclxuICAgfSk7XHJcbiB9XHJcblxyXG4vKipcclxuICogRmV0Y2ggYWxsIGN1aXNpbmVzIGFuZCBzZXQgdGhlaXIgSFRNTC5cclxuICovXHJcbmZldGNoQ3Vpc2luZXMgPSAoKSA9PiB7XHJcbiAgIERCSGVscGVyLmZldGNoQ3Vpc2luZXMoKGVycm9yLCBjdWlzaW5lcykgPT4ge1xyXG4gICAgIGlmIChlcnJvcikgeyAvLyBHb3QgYW4gZXJyb3IhXHJcbiAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICAgICB9IGVsc2Uge1xyXG4gICAgICAgc2VsZi5jdWlzaW5lcyA9IGN1aXNpbmVzO1xyXG4gICAgICAgZmlsbEN1aXNpbmVzSFRNTCgpO1xyXG4gICAgIH1cclxuICAgfSk7XHJcbiB9XHJcblxyXG4vKipcclxuICogU2V0IGN1aXNpbmVzIEhUTUwuXHJcbiAqL1xyXG4gZmlsbEN1aXNpbmVzSFRNTCA9IChjdWlzaW5lcyA9IHNlbGYuY3Vpc2luZXMpID0+IHtcclxuICAgY29uc3Qgc2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N1aXNpbmVzLXNlbGVjdCcpO1xyXG4gICBjdWlzaW5lcy5mb3JFYWNoKGN1aXNpbmUgPT4ge1xyXG4gICAgIGNvbnN0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xyXG4gICAgIG9wdGlvbi5pbm5lckhUTUwgPSBjdWlzaW5lO1xyXG4gICAgIG9wdGlvbi52YWx1ZSA9IGN1aXNpbmU7XHJcbiAgICAgb3B0aW9uLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGN1aXNpbmUpO1xyXG4gICAgIG9wdGlvbi5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnb3B0aW9uJyk7XHJcbiAgICAgc2VsZWN0LmFwcGVuZChvcHRpb24pO1xyXG4gICB9KTtcclxuIH1cclxuXHJcbi8qKlxyXG4gKiBJbml0aWFsaXplIEdvb2dsZSBtYXAsIGNhbGxlZCBmcm9tIEhUTUwuXHJcbiAqL1xyXG53aW5kb3cuaW5pdE1hcCA9ICgpID0+IHtcclxuICBsZXQgbG9jID0ge1xyXG4gICAgbGF0OiA0MC43MjIyMTYsXHJcbiAgICBsbmc6IC03My45ODc1MDFcclxuICB9O1xyXG4gIHNlbGYubWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwJyksIHtcclxuICAgIHpvb206IDEyLFxyXG4gICAgY2VudGVyOiBsb2MsXHJcbiAgICBzY3JvbGx3aGVlbDogZmFsc2VcclxuICB9KTtcclxuICB1cGRhdGVSZXN0YXVyYW50cygpO1xyXG59XHJcblxyXG4vKipcclxuICogVXBkYXRlIHBhZ2UgYW5kIG1hcCBmb3IgY3VycmVudCByZXN0YXVyYW50cy5cclxuICovXHJcbnVwZGF0ZVJlc3RhdXJhbnRzID0gKCkgPT4ge1xyXG4gIGNvbnN0IGNTZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3Vpc2luZXMtc2VsZWN0Jyk7XHJcbiAgY29uc3QgblNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZWlnaGJvcmhvb2RzLXNlbGVjdCcpO1xyXG5cclxuICBjb25zdCBjSW5kZXggPSBjU2VsZWN0LnNlbGVjdGVkSW5kZXg7XHJcbiAgY29uc3QgbkluZGV4ID0gblNlbGVjdC5zZWxlY3RlZEluZGV4O1xyXG5cclxuICBjb25zdCBjdWlzaW5lID0gY1NlbGVjdFtjSW5kZXhdLnZhbHVlO1xyXG4gIGNvbnN0IG5laWdoYm9yaG9vZCA9IG5TZWxlY3RbbkluZGV4XS52YWx1ZTtcclxuXHJcbiAgREJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50QnlDdWlzaW5lQW5kTmVpZ2hib3Job29kKGN1aXNpbmUsIG5laWdoYm9yaG9vZCwgKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xyXG4gICAgaWYgKGVycm9yKSB7IC8vIEdvdCBhbiBlcnJvciFcclxuICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXNldFJlc3RhdXJhbnRzKHJlc3RhdXJhbnRzKTtcclxuICAgICAgZmlsbFJlc3RhdXJhbnRzSFRNTCgpO1xyXG4gICAgICBteUxhenlMb2FkLnVwZGF0ZSgpO1xyXG4gICAgfVxyXG4gIH0pXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDbGVhciBjdXJyZW50IHJlc3RhdXJhbnRzLCB0aGVpciBIVE1MIGFuZCByZW1vdmUgdGhlaXIgbWFwIG1hcmtlcnMuXHJcbiAqL1xyXG5yZXNldFJlc3RhdXJhbnRzID0gKHJlc3RhdXJhbnRzKSA9PiB7XHJcbiAgLy8gUmVtb3ZlIGFsbCByZXN0YXVyYW50c1xyXG4gIHNlbGYucmVzdGF1cmFudHMgPSBbXTtcclxuICBjb25zdCB1bCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50cy1saXN0Jyk7XHJcbiAgdWwuaW5uZXJIVE1MID0gJyc7XHJcblxyXG4gIC8vIFJlbW92ZSBhbGwgbWFwIG1hcmtlcnNcclxuICBzZWxmLm1hcmtlcnMuZm9yRWFjaChtYXJrZXIgPT4gbWFya2VyLnNldE1hcChudWxsKSk7XHJcbiAgc2VsZi5tYXJrZXJzID0gW107XHJcbiAgc2VsZi5yZXN0YXVyYW50cyA9IHJlc3RhdXJhbnRzO1xyXG59XHJcblxyXG4vKipcclxuICogQ3JlYXRlIGFsbCByZXN0YXVyYW50cyBIVE1MIGFuZCBhZGQgdGhlbSB0byB0aGUgd2VicGFnZS5cclxuICovXHJcbiBmaWxsUmVzdGF1cmFudHNIVE1MID0gKHJlc3RhdXJhbnRzID0gc2VsZi5yZXN0YXVyYW50cykgPT4ge1xyXG4gICBjb25zdCB1bCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50cy1saXN0Jyk7XHJcbiAgIHJlc3RhdXJhbnRzLmZvckVhY2gocmVzdGF1cmFudCA9PiB7XHJcbiAgICAgdWwuYXBwZW5kKGNyZWF0ZVJlc3RhdXJhbnRIVE1MKHJlc3RhdXJhbnQpKTtcclxuICAgfSk7XHJcbiAgIGFkZE1hcmtlcnNUb01hcCgpO1xyXG4gICBteUxhenlMb2FkLnVwZGF0ZSgpO1xyXG4gfVxyXG5cclxuLyoqXHJcbiAqIENyZWF0ZSByZXN0YXVyYW50IEhUTUwuXHJcbiAqL1xyXG5jcmVhdGVSZXN0YXVyYW50SFRNTCA9IChyZXN0YXVyYW50ID0gc2VsZi5yZXN0YXVyYW50cykgPT4ge1xyXG4gIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuICBsaS5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnbGlzdGl0ZW0nKTtcclxuXHJcbiAgY29uc3QgaW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcclxuICBpbWFnZS5jbGFzc05hbWUgPSAncmVzdGF1cmFudC1pbWcnO1xyXG4gIGltYWdlLnNyYyA9IERCSGVscGVyLmltYWdlVXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KTtcclxuICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBcImltZ19cIiArIHJlc3RhdXJhbnQuaWQpO1xyXG4gIGltYWdlLnNldEF0dHJpYnV0ZSgncm9sZScsICdpbWcnKTtcclxuICBjb25zdCBhbHROYW1lID0gcmVzdGF1cmFudC5kZXNjcmlwdGlvbjtcclxuICBpbWFnZS5hbHQgPSBhbHROYW1lO1xyXG4gIGxpLmFwcGVuZChpbWFnZSk7XHJcblxyXG4gIGNvbnN0IG5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xyXG4gIG5hbWUuaW5uZXJIVE1MID0gcmVzdGF1cmFudC5uYW1lO1xyXG4gIGxpLmFwcGVuZChuYW1lKTtcclxuXHJcbiAgY29uc3QgZmF2b3JpdGVDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICBjb25zdCBmYXZvcml0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICBmYXZvcml0ZUNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnZmF2b3JpdGUgaGVhcnQnKTtcclxuICBmYXZvcml0ZS5jbGFzc0xpc3QuYWRkKCdmYXZvcml0ZScpO1xyXG4gIGlmKHJlc3RhdXJhbnQuaXNfZmF2b3JpdGUpIGZhdm9yaXRlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG4gIGZhdm9yaXRlLmlubmVySFRNTCA9ICfwn5akJztcclxuICBmYXZvcml0ZS5zZXRBdHRyaWJ1dGUoJ2lkJywgcmVzdGF1cmFudC5pZCk7XHJcbiAgZmF2b3JpdGUuc2V0QXR0cmlidXRlKCdyb2xlJywgJ2J1dHRvbicpO1xyXG4gIGZhdm9yaXRlLnRpdGxlID0gKHJlc3RhdXJhbnQuaXNfZmF2b3JpdGUpID8gJ1JlbW92ZSBmcm9tIEZhdm9yaXRlcycgOiAnQWRkIHRvIEZhdm9yaXRlcyc7XHJcbiAgZmF2b3JpdGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVGYXZvcml0ZSk7XHJcbiAgZmF2b3JpdGVDb250YWluZXIuYXBwZW5kKGZhdm9yaXRlKTtcclxuICBsaS5hcHBlbmQoZmF2b3JpdGUpO1xyXG5cclxuICBjb25zdCBuZWlnaGJvcmhvb2QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XHJcbiAgbmVpZ2hib3Job29kLmlubmVySFRNTCA9IHJlc3RhdXJhbnQubmVpZ2hib3Job29kO1xyXG4gIGxpLmFwcGVuZChuZWlnaGJvcmhvb2QpO1xyXG5cclxuICBjb25zdCBhZGRyZXNzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xyXG4gIGFkZHJlc3MuaW5uZXJIVE1MID0gcmVzdGF1cmFudC5hZGRyZXNzO1xyXG4gIGxpLmFwcGVuZChhZGRyZXNzKTtcclxuXHJcbiAgY29uc3QgbW9yZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICBtb3JlLmlubmVySFRNTCA9ICdWaWV3IERldGFpbHMnO1xyXG4gIG1vcmUuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ1ZpZXcgcmVzdGF1cmFudCBkZXRhaWxzJyk7XHJcbiAgbW9yZS5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnYnV0dG9uJyk7XHJcbiAgbW9yZS5ocmVmID0gREJIZWxwZXIudXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KTtcclxuICBsaS5hcHBlbmQobW9yZSlcclxuXHJcbiAgcmV0dXJuIGxpO1xyXG59XHJcblxyXG52YXIgaW1hZ2VMYXp5TG9hZCA9IG5ldyBMYXp5TG9hZCh7XHJcbiAgICBlbGVtZW50c19zZWxlY3RvcjogXCIucmVzdGF1cmFudC1pbWdcIlxyXG59KTtcclxuXHJcbnRvZ2dsZUZhdm9yaXRlID0gKGV2ZW50KSA9PiB7XHJcbiAgY29uc3QgaWQgPSBOdW1iZXIoZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnaWQnKSk7XHJcbiAgY29uc3QgaXNfZmF2b3JpdGUgPSAhZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJyk7XHJcblxyXG4gIERCSGVscGVyLmZldGNoRmF2b3JpdGUoaWQsIGlzX2Zhdm9yaXRlKVxyXG4gIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgIGV2ZW50LnRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcclxuICAgIGV2ZW50LnRhcmdldC50aXRsZSA9IChyZXNwb25zZS5pc19mYXZvcml0ZSkgPyAnUmVtb3ZlIGZyb20gRmF2b3JpdGVzJyA6ICdBZGQgdG8gRmF2b3JpdGVzJztcclxuICB9KVxyXG59XHJcblxyXG4vKipcclxuICogQWRkIG1hcmtlcnMgZm9yIGN1cnJlbnQgcmVzdGF1cmFudHMgdG8gdGhlIG1hcC5cclxuICovXHJcbiBhZGRNYXJrZXJzVG9NYXAgPSAocmVzdGF1cmFudHMgPSBzZWxmLnJlc3RhdXJhbnRzKSA9PiB7XHJcbiAgIHJlc3RhdXJhbnRzLmZvckVhY2gocmVzdGF1cmFudCA9PiB7XHJcbiAgICAgLy8gQWRkIG1hcmtlciB0byB0aGUgbWFwXHJcbiAgICAgY29uc3QgbWFya2VyID0gREJIZWxwZXIubWFwTWFya2VyRm9yUmVzdGF1cmFudChyZXN0YXVyYW50LCBzZWxmLm1hcCk7XHJcbiAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCAnY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IG1hcmtlci51cmxcclxuICAgICB9KTtcclxuICAgICBzZWxmLm1hcmtlcnMucHVzaChtYXJrZXIpO1xyXG4gICB9KTtcclxuIH1cclxuXHJcbiAvKipcclxuICAqIFNob3cgbWFwIGFmdGVyIG9uY2xpY2sgZXZlbnRcclxuICAqL1xyXG4gZnVuY3Rpb24gc2hvd01hcCgpIHtcclxuICAgY29uc3QgbXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1hcFwiKTtcclxuICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYXAtYnV0dG9uXCIpO1xyXG4gICBtcC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICBidXR0b24uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gfVxyXG4iXSwiZmlsZSI6Im1haW4uanMifQ==
