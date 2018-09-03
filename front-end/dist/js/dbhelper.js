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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkYmhlbHBlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQ29tbW9uIGRhdGFiYXNlIGhlbHBlciBmdW5jdGlvbnMuXHJcbiAqL1xyXG5jbGFzcyBEQkhlbHBlciB7XHJcbiAgLyoqXHJcbiAgICogRGF0YWJhc2UgVVJMLlxyXG4gICAqIENoYW5nZSB0aGlzIHRvIHJlc3RhdXJhbnRzLmpzb24gZmlsZSBsb2NhdGlvbiBvbiB5b3VyIHNlcnZlci5cclxuICAgKi9cclxuICAgc3RhdGljIGdldCBEQVRBQkFTRV9VUkwoKSB7XHJcbiAgICAgY29uc3QgcG9ydCA9IDEzMzcgLy8gQ2hhbmdlIHRoaXMgdG8geW91ciBzZXJ2ZXIgcG9ydFxyXG4gICAgIHJldHVybiBgaHR0cDovL2xvY2FsaG9zdDoke3BvcnR9L3Jlc3RhdXJhbnRzYDtcclxuICAgfVxyXG5cclxuICAgc3RhdGljIGdldCBSRVZJRVdTX1VSTCgpIHtcclxuICAgICBjb25zdCBwb3J0ID0gMTMzNyAvLyBDaGFuZ2UgdGhpcyB0byB5b3VyIHNlcnZlciBwb3J0XHJcbiAgICAgcmV0dXJuIGBodHRwOi8vbG9jYWxob3N0OiR7cG9ydH0vcmV2aWV3c2A7XHJcbiAgIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRmV0Y2ggYWxsIHJlc3RhdXJhbnRzLlxyXG4gICAqL1xyXG4gICBzdGF0aWMgZmV0Y2hSZXN0YXVyYW50cyhjYWxsYmFjaykge1xyXG4gICAgY29uc3QgcmVzdGF1cmFudHNVUkwgPSBgJHtEQkhlbHBlci5EQVRBQkFTRV9VUkx9YDtcclxuICAgIGZldGNoKHJlc3RhdXJhbnRzVVJMKVxyXG4gICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICByZXNwb25zZS5qc29uKClcclxuICAgICAgICAgICAgLnRoZW4oanNvbiA9PiB7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwganNvbik7XHJcbiAgICAgICAgICAgIH0pLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjYWxsYmFjaygoYFJlcXVlc3QgZmFpbGVkLiAke3Jlc3BvbnNlLnN0YXR1c31gKSwgbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgICkuY2F0Y2goZXJyb3IgPT4gY2FsbGJhY2soZXJyb3IsIG51bGwpKTtcclxuICB9XHJcbiAgLyoqXHJcbiAgICogRmV0Y2ggYSByZXN0YXVyYW50IGJ5IGl0cyBJRC5cclxuICAgKi9cclxuICAgc3RhdGljIGZldGNoUmVzdGF1cmFudEJ5SWQoaWQsIGNhbGxiYWNrKSB7XHJcbiAgICAgLy8gZmV0Y2ggYWxsIHJlc3RhdXJhbnRzIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxyXG4gICAgIERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xyXG4gICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgIGNvbnN0IHJlc3RhdXJhbnQgPSByZXN0YXVyYW50cy5maW5kKHIgPT4gci5pZCA9PSBpZCk7XHJcbiAgICAgICAgIGlmIChyZXN0YXVyYW50KSB7IC8vIEdvdCB0aGUgcmVzdGF1cmFudFxyXG4gICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3RhdXJhbnQpO1xyXG4gICAgICAgICB9IGVsc2UgeyAvLyBSZXN0YXVyYW50IGRvZXMgbm90IGV4aXN0IGluIHRoZSBkYXRhYmFzZVxyXG4gICAgICAgICAgIGNhbGxiYWNrKCdSZXN0YXVyYW50IGRvZXMgbm90IGV4aXN0JywgbnVsbCk7XHJcbiAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICB9KTtcclxuICAgfVxyXG5cclxuICAvKipcclxuICAgKiBGZXRjaCByZXN0YXVyYW50cyBieSBhIGN1aXNpbmUgdHlwZSB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cclxuICAgKi9cclxuICAgc3RhdGljIGZldGNoUmVzdGF1cmFudEJ5Q3Vpc2luZShjdWlzaW5lLCBjYWxsYmFjaykge1xyXG4gICAgIC8vIEZldGNoIGFsbCByZXN0YXVyYW50cyAgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmdcclxuICAgICBEQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcclxuICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAvLyBGaWx0ZXIgcmVzdGF1cmFudHMgdG8gaGF2ZSBvbmx5IGdpdmVuIGN1aXNpbmUgdHlwZVxyXG4gICAgICAgICBjb25zdCByZXN1bHRzID0gcmVzdGF1cmFudHMuZmlsdGVyKHIgPT4gci5jdWlzaW5lX3R5cGUgPT0gY3Vpc2luZSk7XHJcbiAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdHMpO1xyXG4gICAgICAgfVxyXG4gICAgIH0pO1xyXG4gICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZldGNoIHJlc3RhdXJhbnRzIGJ5IGEgbmVpZ2hib3Job29kIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxyXG4gICAqL1xyXG4gICBzdGF0aWMgZmV0Y2hSZXN0YXVyYW50QnlOZWlnaGJvcmhvb2QobmVpZ2hib3Job29kLCBjYWxsYmFjaykge1xyXG4gICAgIC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xyXG4gICAgIERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xyXG4gICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgIC8vIEZpbHRlciByZXN0YXVyYW50cyB0byBoYXZlIG9ubHkgZ2l2ZW4gbmVpZ2hib3Job29kXHJcbiAgICAgICAgIGNvbnN0IHJlc3VsdHMgPSByZXN0YXVyYW50cy5maWx0ZXIociA9PiByLm5laWdoYm9yaG9vZCA9PSBuZWlnaGJvcmhvb2QpO1xyXG4gICAgICAgICBjYWxsYmFjayhudWxsLCByZXN1bHRzKTtcclxuICAgICAgIH1cclxuICAgICB9KTtcclxuICAgfVxyXG5cclxuICAvKipcclxuICAgKiBGZXRjaCByZXN0YXVyYW50cyBieSBhIGN1aXNpbmUgYW5kIGEgbmVpZ2hib3Job29kIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxyXG4gICAqL1xyXG4gICBzdGF0aWMgZmV0Y2hSZXN0YXVyYW50QnlDdWlzaW5lQW5kTmVpZ2hib3Job29kKGN1aXNpbmUsIG5laWdoYm9yaG9vZCwgY2FsbGJhY2spIHtcclxuICAgICAvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHNcclxuICAgICBEQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcclxuICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICBsZXQgcmVzdWx0cyA9IHJlc3RhdXJhbnRzXHJcbiAgICAgICAgIGlmIChjdWlzaW5lICE9ICdhbGwnKSB7IC8vIGZpbHRlciBieSBjdWlzaW5lXHJcbiAgICAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMuZmlsdGVyKHIgPT4gci5jdWlzaW5lX3R5cGUgPT0gY3Vpc2luZSk7XHJcbiAgICAgICAgIH1cclxuICAgICAgICAgaWYgKG5laWdoYm9yaG9vZCAhPSAnYWxsJykgeyAvLyBmaWx0ZXIgYnkgbmVpZ2hib3Job29kXHJcbiAgICAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMuZmlsdGVyKHIgPT4gci5uZWlnaGJvcmhvb2QgPT0gbmVpZ2hib3Job29kKTtcclxuICAgICAgICAgfVxyXG4gICAgICAgICBjYWxsYmFjayhudWxsLCByZXN1bHRzKTtcclxuICAgICAgIH1cclxuICAgICB9KTtcclxuICAgfVxyXG5cclxuICAvKipcclxuICAgKiBGZXRjaCBhbGwgbmVpZ2hib3Job29kcyB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cclxuICAgKi9cclxuICAgc3RhdGljIGZldGNoTmVpZ2hib3Job29kcyhjYWxsYmFjaykge1xyXG4gICAgIC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xyXG4gICAgIERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xyXG4gICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgIC8vIEdldCBhbGwgbmVpZ2hib3Job29kcyBmcm9tIGFsbCByZXN0YXVyYW50c1xyXG4gICAgICAgICBjb25zdCBuZWlnaGJvcmhvb2RzID0gcmVzdGF1cmFudHMubWFwKCh2LCBpKSA9PiByZXN0YXVyYW50c1tpXS5uZWlnaGJvcmhvb2QpXHJcbiAgICAgICAgIC8vIFJlbW92ZSBkdXBsaWNhdGVzIGZyb20gbmVpZ2hib3Job29kc1xyXG4gICAgICAgICBjb25zdCB1bmlxdWVOZWlnaGJvcmhvb2RzID0gbmVpZ2hib3Job29kcy5maWx0ZXIoKHYsIGkpID0+IG5laWdoYm9yaG9vZHMuaW5kZXhPZih2KSA9PSBpKVxyXG4gICAgICAgICBjYWxsYmFjayhudWxsLCB1bmlxdWVOZWlnaGJvcmhvb2RzKTtcclxuICAgICAgIH1cclxuICAgICB9KTtcclxuICAgfVxyXG5cclxuICAvKipcclxuICAgKiBGZXRjaCBhbGwgY3Vpc2luZXMgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXHJcbiAgICovXHJcbiAgIHN0YXRpYyBmZXRjaEN1aXNpbmVzKGNhbGxiYWNrKSB7XHJcbiAgICAgLy8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzXHJcbiAgICAgREJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XHJcbiAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgLy8gR2V0IGFsbCBjdWlzaW5lcyBmcm9tIGFsbCByZXN0YXVyYW50c1xyXG4gICAgICAgICBjb25zdCBjdWlzaW5lcyA9IHJlc3RhdXJhbnRzLm1hcCgodiwgaSkgPT4gcmVzdGF1cmFudHNbaV0uY3Vpc2luZV90eXBlKVxyXG4gICAgICAgICAvLyBSZW1vdmUgZHVwbGljYXRlcyBmcm9tIGN1aXNpbmVzXHJcbiAgICAgICAgIGNvbnN0IHVuaXF1ZUN1aXNpbmVzID0gY3Vpc2luZXMuZmlsdGVyKCh2LCBpKSA9PiBjdWlzaW5lcy5pbmRleE9mKHYpID09IGkpXHJcbiAgICAgICAgIGNhbGxiYWNrKG51bGwsIHVuaXF1ZUN1aXNpbmVzKTtcclxuICAgICAgIH1cclxuICAgICB9KTtcclxuICAgfVxyXG5cclxuICAgLyoqXHJcbiAgICogUmVzdGF1cmFudCBmYXZvcml0ZVxyXG4gICAqL1xyXG4gICBzdGF0aWMgZmV0Y2hGYXZvcml0ZShpZCwgdmFsdWUpe1xyXG4gICAgIGxldCBpc19mYXZvcml0ZSA9IHtcclxuICAgICAgIFwiaXNfZmF2b3JpdGVcIjogdmFsdWVcclxuICAgICB9O1xyXG5cclxuICAgICByZXR1cm4gZmV0Y2goREJIZWxwZXIuREFUQUJBU0VfVVJMKycvJytpZCsnLycsIHtcclxuICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGlzX2Zhdm9yaXRlKSxcclxuICAgICAgIG1ldGhvZDogJ1BVVCcsXHJcbiAgICAgICBoZWFkZXJzOiBuZXcgSGVhZGVycyh7XHJcblx0XHRcdFx0J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG5cdFx0XHR9KVxyXG4gICAgIH0pXHJcbiAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgaWYocmVzcG9uc2Uub2spIHtcclxuICAgICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIFt7fV07XHJcbiAgICAgICB9XHJcbiAgICAgfSlcclxuICAgICAudGhlbihyZXNwb25zZSA9PiBjb25zb2xlLmxvZyhgVXBkYXRlZCBmYXZvcml0ZSByZXN0YXVyYW50OiAke2lkfSBmYXZvcml0ZSA6ICR7dmFsdWV9YCkpO1xyXG4gICB9XHJcblxyXG4gICAvKipcclxuICAgICogRmV0Y2ggYWxsIHJldmlld3MuXHJcbiAgICAqL1xyXG4gICAgc3RhdGljIGZldGNoUmV2aWV3KGNhbGxiYWNrKSB7XHJcbiAgICAgY29uc3QgcmV2aWV3c1VSTCA9IGAke0RCSGVscGVyLlJFVklFV1NfVVJMfWA7XHJcbiAgICAgZmV0Y2gocmV2aWV3c1VSTClcclxuICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgIHJlc3BvbnNlLmpzb24oKVxyXG4gICAgICAgICAgICAgICAudGhlbihqc29uID0+IHtcclxuICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCBqc29uKTtcclxuICAgICAgICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbClcclxuICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICBjYWxsYmFjaygoYFJlcXVlc3QgZmFpbGVkLiBSZXR1cm5lZCBzdGF0dXMgb2YgJHtyZXNwb25zZS5zdGF0dXN9YCksIG51bGwpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgfVxyXG4gICAgICAgKS5jYXRjaChlcnJvciA9PiBjYWxsYmFjayhlcnJvciwgbnVsbCkpO1xyXG4gICB9XHJcblxyXG4gICAvKipcclxuICAgKiBGZXRjaCBhIHJldmlldyBieSByZXN0YXVyYW50IGlkLlxyXG4gICAqL1xyXG4gICBzdGF0aWMgZmV0Y2hSZXZpZXdCeUlkKGlkLCBjYWxsYmFjaykge1xyXG4gICAgIGNvbnN0IHJldmlld3NVUkwgPSBgJHtEQkhlbHBlci5SRVZJRVdTX1VSTH0vP3Jlc3RhdXJhbnRfaWQ9JHtpZH1gO1xyXG4gICAgIGZldGNoKHJldmlld3NVUkwpXHJcbiAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICByZXNwb25zZS5qc29uKClcclxuICAgICAgICAgICAgICAgLnRoZW4oanNvbiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwganNvbik7XHJcbiAgICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgICAgIH0pLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpXHJcbiAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgY2FsbGJhY2soKGBSZXF1ZXN0IGZhaWxlZC4gUmV0dXJuZWQgc3RhdHVzIG9mICR7cmVzcG9uc2Uuc3RhdHVzfWApLCBudWxsKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgIH1cclxuICAgICAgICkuY2F0Y2goZXJyb3IgPT4gY2FsbGJhY2soZXJyb3IsIG51bGwpKTtcclxuICAgfVxyXG5cclxuICAvKipcclxuICAgKiBQb3N0IHJldmlld3NcclxuICAqL1xyXG4gIHN0YXRpYyBzZW5kUmV2aWV3KHJldmlldykge1xyXG4gIFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gIFx0XHRcdGZldGNoKHRoaXMuUkVWSUVXU19VUkwsIHtcclxuICBcdFx0XHRcdGJvZHk6IEpTT04uc3RyaW5naWZ5KHJldmlldyksXHJcbiAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gIFx0XHRcdFx0aGVhZGVyczoge1xyXG4gIFx0XHRcdFx0XHRcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxyXG4gIFx0XHRcdFx0fVxyXG4gIFx0XHRcdH0pXHJcbiAgXHRcdFx0XHQudGhlbihyZXNvbHZlKVxyXG4gIFx0XHRcdFx0LmNhdGNoKHJlamVjdCk7XHJcbiAgXHRcdH0pXHJcbiAgXHR9XHJcblxyXG4gIHN0YXRpYyBjYWNoZVJldmlldyhyZXZpZXcpIHtcclxuXHRcdGlmICghbmF2aWdhdG9yLm9ubGluZSkge1xyXG5cdFx0XHR3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJjYWNoZS1yZXZpZXctXCIgKyByZXZpZXcucmVzdGF1cmFudF9pZCwgSlNPTi5zdHJpbmdpZnkocmV2aWV3KSk7XHJcblx0XHRcdHRoaXMud2F0Y2hSZXZpZXcocmV2aWV3LnJlc3RhdXJhbnRfaWQpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbiAgc3RhdGljIHdhdGNoUmV2aWV3KGlkKSB7XHJcblx0XHRpZiAoIW5hdmlnYXRvci5vbmxpbmUpIHtcclxuXHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJvbmxpbmVcIiwgZXZlbnQgPT4ge1xyXG5cdFx0XHRcdGlmICh3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJjYWNoZS1yZXZpZXctXCIgKyBpZCkgIT09IG51bGwpIHtcclxuXHRcdFx0XHRcdHRoaXMuY2xlYXJPZmZsaW5lKGlkKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5jbGVhck9mZmxpbmUoaWQpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c3RhdGljIGNsZWFyT2ZmbGluZShpZCkge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0dGhpcy5zZW5kUmV2aWV3KEpTT04ucGFyc2Uod2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiY2FjaGUtcmV2aWV3LVwiICsgaWQpKSlcclxuXHRcdFx0XHQudGhlbihyZXNwb25zZSA9PiB7XHJcblx0XHRcdFx0XHR3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJjYWNoZS1yZXZpZXctXCIgKyBpZCk7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm9mZmxpbmVcIikuZm9yRWFjaChyZXZpZXcgPT4ge1xyXG5cdFx0XHRcdFx0XHRyZXZpZXcuY2xhc3NMaXN0LnJlbW92ZShcIm9mZmxpbmVcIik7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC5jYXRjaChjb25zb2xlLmVycm9yKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5lcnJvcihlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlc3RhdXJhbnQgcGFnZSBVUkwuXHJcbiAgICovXHJcbiAgIHN0YXRpYyB1cmxGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpIHtcclxuICAgICByZXR1cm4gKGAuL3Jlc3RhdXJhbnQuaHRtbD9pZD0ke3Jlc3RhdXJhbnQuaWR9YCk7XHJcbiAgIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVzdGF1cmFudCBpbWFnZSBVUkwuXHJcbiAgICovXHJcbiAgc3RhdGljIGltYWdlVXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSB7XHJcbiAgICByZXR1cm4gKGAvaW1nLyR7cmVzdGF1cmFudC5waG90b2dyYXBofS5qcGdgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1hcCBtYXJrZXIgZm9yIGEgcmVzdGF1cmFudC5cclxuICAgKi9cclxuICBzdGF0aWMgbWFwTWFya2VyRm9yUmVzdGF1cmFudChyZXN0YXVyYW50LCBtYXApIHtcclxuICAgIGNvbnN0IG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xyXG4gICAgICBwb3NpdGlvbjogcmVzdGF1cmFudC5sYXRsbmcsXHJcbiAgICAgIHRpdGxlOiByZXN0YXVyYW50Lm5hbWUsXHJcbiAgICAgIHVybDogREJIZWxwZXIudXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSxcclxuICAgICAgbWFwOiBtYXAsXHJcbiAgICAgIGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1B9XHJcbiAgICApO1xyXG4gICAgcmV0dXJuIG1hcmtlcjtcclxuICB9XHJcblxyXG59XHJcbiJdLCJmaWxlIjoiZGJoZWxwZXIuanMifQ==
