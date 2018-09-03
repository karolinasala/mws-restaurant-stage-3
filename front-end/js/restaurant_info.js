let restaurant;
var map;

/**
 * Initialize map as soon as the page is loaded.
 */
 window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
 }

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) {
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) {
    error = 'No restaurant id in URL';
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant);
    });
  }
}

/**
 * Fetch Review from URL
 */
fetchReviewFromURL = (callback) => {
  if (self.review) {
    callback(null, self.reviews);
    return;
  }
  const id = getParameterByName('id');
  if (!id) {
    error = 'No review id';
    callback(error, null);
  } else {
    DBHelper.fetchReviewById(id,(error, reviews) => {
      self.reviews = reviews;
      if (!reviews) {
        console.error(error);
        return;
      }
      fillReviewsHTML();
    })
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant);

  const altName = restaurant.name + ' in ' + restaurant.neighborhood;
  image.alt = altName;

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  fetchReviewFromURL();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h3');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.insertBefore(createReviewHTML(review), ul.firstChild);
  });
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.innerHTML = review.name;
  li.appendChild(name);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  const a = document.createElement("a");
  a.innerHTML = restaurant.name;
  a.setAttribute("aria-current", "page");
  li.appendChild(a);
  breadcrumb.appendChild(li);
}

/**
 *  Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**
 * Send review.
 */

sendReview = () => {
	event.preventDefault();
	const restaurant_id = getParameterByName("id");
	const name = document.querySelector("#name").value;
	const rating = parseInt(document.querySelector('#rating option:checked').value);
	const comments = document.querySelector("#comment").value;
	const data = {
		restaurant_id: parseInt(restaurant_id),
		name: name,
		rating: rating,
		comments: comments,
    createdAt: Date.now(),
    updatedAt: Date.now()
	};
	DBHelper.sendReview(data)
  .then(response => {
		let reviewList = document.getElementById("reviews-list");
		reviewList.insertBefore(createReviewHTML(data), reviewList.firstChild);
	}).catch(err => {
			console.error(err);
			let reviewList = document.getElementById("reviews-list");
			reviewList.insertBefore(createReviewHTML(data, true), reviewList.firstChild);
			DBHelper.cacheReview(data);
		});

  document.getElementById("review-form").reset();
}

document.getElementById('send-review').addEventListener('click', sendReview);


/**
 * Show map after onclick event
 */
function showMap() {
  const mp = document.getElementById("map");
  const button = document.getElementById("map-button");
  mp.style.display = "block";
  button.style.display = "none";
}
