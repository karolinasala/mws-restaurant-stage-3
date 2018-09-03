/**
 * Common database helper functions.
 */
class DBHelper {
  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
   static get DATABASE_URL() {
     const port = 1337 // Change this to your server port
     return `http://localhost:${port}/restaurants`;
   }

   static get REVIEWS_URL() {
     const port = 1337 // Change this to your server port
     return `http://localhost:${port}/reviews`;
   }

  /**
   * Fetch all restaurants.
   */
   static fetchRestaurants(callback) {
    const restaurantsURL = `${DBHelper.DATABASE_URL}`;
    fetch(restaurantsURL)
      .then(response => {
        if (response.status === 200) {
          response.json()
            .then(json => {
              callback(null, json);
            }).catch(error => {
              callback(error, null);
            });
        } else {
          callback((`Request failed. ${response.status}`), null);
        }
      }
      ).catch(error => callback(error, null));
  }
  /**
   * Fetch a restaurant by its ID.
   */
   static fetchRestaurantById(id, callback) {
     // fetch all restaurants with proper error handling.
     DBHelper.fetchRestaurants((error, restaurants) => {
       if (error) {
         callback(error, null);
       } else {
         const restaurant = restaurants.find(r => r.id == id);
         if (restaurant) { // Got the restaurant
           callback(null, restaurant);
         } else { // Restaurant does not exist in the database
           callback('Restaurant does not exist', null);
         }
       }
     });
   }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
   static fetchRestaurantByCuisine(cuisine, callback) {
     // Fetch all restaurants  with proper error handling
     DBHelper.fetchRestaurants((error, restaurants) => {
       if (error) {
         callback(error, null);
       } else {
         // Filter restaurants to have only given cuisine type
         const results = restaurants.filter(r => r.cuisine_type == cuisine);
         callback(null, results);
       }
     });
   }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
   static fetchRestaurantByNeighborhood(neighborhood, callback) {
     // Fetch all restaurants
     DBHelper.fetchRestaurants((error, restaurants) => {
       if (error) {
         callback(error, null);
       } else {
         // Filter restaurants to have only given neighborhood
         const results = restaurants.filter(r => r.neighborhood == neighborhood);
         callback(null, results);
       }
     });
   }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
   static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
     // Fetch all restaurants
     DBHelper.fetchRestaurants((error, restaurants) => {
       if (error) {
         callback(error, null);
       } else {
         let results = restaurants
         if (cuisine != 'all') { // filter by cuisine
           results = results.filter(r => r.cuisine_type == cuisine);
         }
         if (neighborhood != 'all') { // filter by neighborhood
           results = results.filter(r => r.neighborhood == neighborhood);
         }
         callback(null, results);
       }
     });
   }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
   static fetchNeighborhoods(callback) {
     // Fetch all restaurants
     DBHelper.fetchRestaurants((error, restaurants) => {
       if (error) {
         callback(error, null);
       } else {
         // Get all neighborhoods from all restaurants
         const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
         // Remove duplicates from neighborhoods
         const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
         callback(null, uniqueNeighborhoods);
       }
     });
   }

  /**
   * Fetch all cuisines with proper error handling.
   */
   static fetchCuisines(callback) {
     // Fetch all restaurants
     DBHelper.fetchRestaurants((error, restaurants) => {
       if (error) {
         callback(error, null);
       } else {
         // Get all cuisines from all restaurants
         const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
         // Remove duplicates from cuisines
         const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
         callback(null, uniqueCuisines);
       }
     });
   }

   /**
   * Restaurant favorite
   */
   static fetchFavorite(id, value){
     let is_favorite = {
       "is_favorite": value
     };

     return fetch(DBHelper.DATABASE_URL+'/'+id+'/', {
       body: JSON.stringify(is_favorite),
       method: 'PUT',
       headers: new Headers({
				'Content-Type': 'application/json'
			})
     })
     .then(response => {
       if(response.ok) {
          return response.json();
       } else {
          return [{}];
       }
     })
     .then(response => console.log(`Updated favorite restaurant: ${id} favorite : ${value}`));
   }

   /**
    * Fetch all reviews.
    */
    static fetchReview(callback) {
     const reviewsURL = `${DBHelper.REVIEWS_URL}`;
     fetch(reviewsURL)
       .then(response => {
           if (response.status === 200) {
             response.json()
               .then(json => {
                 callback(null, json);
                 return
               }).catch(error => {
               callback(error, null)
             });
           } else {
             callback((`Request failed. Returned status of ${response.status}`), null);
           }
         }
       ).catch(error => callback(error, null));
   }

   /**
   * Fetch a review by restaurant id.
   */
   static fetchReviewById(id, callback) {
     const reviewsURL = `${DBHelper.REVIEWS_URL}/?restaurant_id=${id}`;
     fetch(reviewsURL)
       .then(response => {
           if (response.status === 200) {
             response.json()
               .then(json => {
                 callback(null, json);
                 return
               }).catch(error => {
               callback(error, null)
             });
           } else {
             callback((`Request failed. Returned status of ${response.status}`), null);
           }
         }
       ).catch(error => callback(error, null));
   }

  /**
   * Post reviews
  */
  static sendReview(review) {
  		return new Promise((resolve, reject) => {
  			fetch(this.REVIEWS_URL, {
  				body: JSON.stringify(review),
          method: "POST",
  				headers: {
  					"Content-Type": "application/json"
  				}
  			})
  				.then(resolve)
  				.catch(reject);
  		})
  	}

  static cacheReview(review) {
		if (!navigator.online) {
			window.localStorage.setItem("cache-review-" + review.restaurant_id, JSON.stringify(review));
			this.watchReview(review.restaurant_id);
		}
	}

  static watchReview(id) {
		if (!navigator.online) {
			window.addEventListener("online", event => {
				if (window.localStorage.getItem("cache-review-" + id) !== null) {
					this.clearOffline(id);
				}
			});
		} else {
			this.clearOffline(id);
		}
	}

	static clearOffline(id) {
		try {
			this.sendReview(JSON.parse(window.localStorage.getItem("cache-review-" + id)))
				.then(response => {
					window.localStorage.removeItem("cache-review-" + id);
					document.querySelectorAll(".offline").forEach(review => {
						review.classList.remove("offline");
					});
				})
				.catch(console.error);
		} catch (e) {
			console.error(e);
		}
	}

  /**
   * Restaurant page URL.
   */
   static urlForRestaurant(restaurant) {
     return (`./restaurant.html?id=${restaurant.id}`);
   }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/img/${restaurant.photograph}.jpg`);
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  }

}
