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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZXN0YXVyYW50X2luZm8uanMiXSwic291cmNlc0NvbnRlbnQiOlsibGV0IHJlc3RhdXJhbnQ7XG52YXIgbWFwO1xuXG4vKipcbiAqIEluaXRpYWxpemUgbWFwIGFzIHNvb24gYXMgdGhlIHBhZ2UgaXMgbG9hZGVkLlxuICovXG4gd2luZG93LmluaXRNYXAgPSAoKSA9PiB7XG4gIGZldGNoUmVzdGF1cmFudEZyb21VUkwoKGVycm9yLCByZXN0YXVyYW50KSA9PiB7XG4gICAgaWYgKGVycm9yKSB7IC8vIEdvdCBhbiBlcnJvciFcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLm1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpLCB7XG4gICAgICAgIHpvb206IDE2LFxuICAgICAgICBjZW50ZXI6IHJlc3RhdXJhbnQubGF0bG5nLFxuICAgICAgICBzY3JvbGx3aGVlbDogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgZmlsbEJyZWFkY3J1bWIoKTtcbiAgICAgIERCSGVscGVyLm1hcE1hcmtlckZvclJlc3RhdXJhbnQoc2VsZi5yZXN0YXVyYW50LCBzZWxmLm1hcCk7XG4gICAgfVxuICB9KTtcbiB9XG5cbi8qKlxuICogR2V0IGN1cnJlbnQgcmVzdGF1cmFudCBmcm9tIHBhZ2UgVVJMLlxuICovXG5mZXRjaFJlc3RhdXJhbnRGcm9tVVJMID0gKGNhbGxiYWNrKSA9PiB7XG4gIGlmIChzZWxmLnJlc3RhdXJhbnQpIHtcbiAgICBjYWxsYmFjayhudWxsLCBzZWxmLnJlc3RhdXJhbnQpXG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IGlkID0gZ2V0UGFyYW1ldGVyQnlOYW1lKCdpZCcpO1xuICBpZiAoIWlkKSB7XG4gICAgZXJyb3IgPSAnTm8gcmVzdGF1cmFudCBpZCBpbiBVUkwnO1xuICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgfSBlbHNlIHtcbiAgICBEQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRCeUlkKGlkLCAoZXJyb3IsIHJlc3RhdXJhbnQpID0+IHtcbiAgICAgIHNlbGYucmVzdGF1cmFudCA9IHJlc3RhdXJhbnQ7XG4gICAgICBpZiAoIXJlc3RhdXJhbnQpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGZpbGxSZXN0YXVyYW50SFRNTCgpO1xuICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdGF1cmFudCk7XG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBGZXRjaCBSZXZpZXcgZnJvbSBVUkxcbiAqL1xuZmV0Y2hSZXZpZXdGcm9tVVJMID0gKGNhbGxiYWNrKSA9PiB7XG4gIGlmIChzZWxmLnJldmlldykge1xuICAgIGNhbGxiYWNrKG51bGwsIHNlbGYucmV2aWV3cyk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IGlkID0gZ2V0UGFyYW1ldGVyQnlOYW1lKCdpZCcpO1xuICBpZiAoIWlkKSB7XG4gICAgZXJyb3IgPSAnTm8gcmV2aWV3IGlkJztcbiAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gIH0gZWxzZSB7XG4gICAgREJIZWxwZXIuZmV0Y2hSZXZpZXdCeUlkKGlkLChlcnJvciwgcmV2aWV3cykgPT4ge1xuICAgICAgc2VsZi5yZXZpZXdzID0gcmV2aWV3cztcbiAgICAgIGlmICghcmV2aWV3cykge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZmlsbFJldmlld3NIVE1MKCk7XG4gICAgfSlcbiAgfVxufVxuXG4vKipcbiAqIENyZWF0ZSByZXN0YXVyYW50IEhUTUwgYW5kIGFkZCBpdCB0byB0aGUgd2VicGFnZVxuICovXG5maWxsUmVzdGF1cmFudEhUTUwgPSAocmVzdGF1cmFudCA9IHNlbGYucmVzdGF1cmFudCkgPT4ge1xuICBjb25zdCBuYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnQtbmFtZScpO1xuICBuYW1lLmlubmVySFRNTCA9IHJlc3RhdXJhbnQubmFtZTtcblxuICBjb25zdCBhZGRyZXNzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnQtYWRkcmVzcycpO1xuICBhZGRyZXNzLmlubmVySFRNTCA9IHJlc3RhdXJhbnQuYWRkcmVzcztcblxuICBjb25zdCBpbWFnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50LWltZycpO1xuICBpbWFnZS5jbGFzc05hbWUgPSAncmVzdGF1cmFudC1pbWcnO1xuICBpbWFnZS5zcmMgPSBEQkhlbHBlci5pbWFnZVVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCk7XG5cbiAgY29uc3QgYWx0TmFtZSA9IHJlc3RhdXJhbnQubmFtZSArICcgaW4gJyArIHJlc3RhdXJhbnQubmVpZ2hib3Job29kO1xuICBpbWFnZS5hbHQgPSBhbHROYW1lO1xuXG4gIGNvbnN0IGN1aXNpbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGF1cmFudC1jdWlzaW5lJyk7XG4gIGN1aXNpbmUuaW5uZXJIVE1MID0gcmVzdGF1cmFudC5jdWlzaW5lX3R5cGU7XG5cbiAgaWYgKHJlc3RhdXJhbnQub3BlcmF0aW5nX2hvdXJzKSB7XG4gICAgZmlsbFJlc3RhdXJhbnRIb3Vyc0hUTUwoKTtcbiAgfVxuICBmZXRjaFJldmlld0Zyb21VUkwoKTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgcmVzdGF1cmFudCBvcGVyYXRpbmcgaG91cnMgSFRNTCB0YWJsZSBhbmQgYWRkIGl0IHRvIHRoZSB3ZWJwYWdlLlxuICovXG5maWxsUmVzdGF1cmFudEhvdXJzSFRNTCA9IChvcGVyYXRpbmdIb3VycyA9IHNlbGYucmVzdGF1cmFudC5vcGVyYXRpbmdfaG91cnMpID0+IHtcbiAgY29uc3QgaG91cnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGF1cmFudC1ob3VycycpO1xuICBmb3IgKGxldCBrZXkgaW4gb3BlcmF0aW5nSG91cnMpIHtcbiAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0cicpO1xuXG4gICAgY29uc3QgZGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICBkYXkuaW5uZXJIVE1MID0ga2V5O1xuICAgIHJvdy5hcHBlbmRDaGlsZChkYXkpO1xuXG4gICAgY29uc3QgdGltZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgdGltZS5pbm5lckhUTUwgPSBvcGVyYXRpbmdIb3Vyc1trZXldO1xuICAgIHJvdy5hcHBlbmRDaGlsZCh0aW1lKTtcblxuICAgIGhvdXJzLmFwcGVuZENoaWxkKHJvdyk7XG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGUgYWxsIHJldmlld3MgSFRNTCBhbmQgYWRkIHRoZW0gdG8gdGhlIHdlYnBhZ2UuXG4gKi9cbmZpbGxSZXZpZXdzSFRNTCA9IChyZXZpZXdzID0gc2VsZi5yZXZpZXdzKSA9PiB7XG4gIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXZpZXdzLWNvbnRhaW5lcicpO1xuICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gzJyk7XG4gIHRpdGxlLmlubmVySFRNTCA9ICdSZXZpZXdzJztcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRpdGxlKTtcblxuICBpZiAoIXJldmlld3MpIHtcbiAgICBjb25zdCBub1Jldmlld3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgbm9SZXZpZXdzLmlubmVySFRNTCA9ICdObyByZXZpZXdzIHlldCEnO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChub1Jldmlld3MpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCB1bCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXZpZXdzLWxpc3QnKTtcbiAgcmV2aWV3cy5mb3JFYWNoKHJldmlldyA9PiB7XG4gICAgdWwuaW5zZXJ0QmVmb3JlKGNyZWF0ZVJldmlld0hUTUwocmV2aWV3KSwgdWwuZmlyc3RDaGlsZCk7XG4gIH0pO1xuICBjb250YWluZXIuYXBwZW5kQ2hpbGQodWwpO1xufVxuXG4vKipcbiAqIENyZWF0ZSByZXZpZXcgSFRNTCBhbmQgYWRkIGl0IHRvIHRoZSB3ZWJwYWdlLlxuICovXG5jcmVhdGVSZXZpZXdIVE1MID0gKHJldmlldykgPT4ge1xuICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gIGNvbnN0IG5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gIG5hbWUuaW5uZXJIVE1MID0gcmV2aWV3Lm5hbWU7XG4gIGxpLmFwcGVuZENoaWxkKG5hbWUpO1xuXG4gIGNvbnN0IHJhdGluZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgcmF0aW5nLmlubmVySFRNTCA9IGBSYXRpbmc6ICR7cmV2aWV3LnJhdGluZ31gO1xuICBsaS5hcHBlbmRDaGlsZChyYXRpbmcpO1xuXG4gIGNvbnN0IGNvbW1lbnRzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBjb21tZW50cy5pbm5lckhUTUwgPSByZXZpZXcuY29tbWVudHM7XG4gIGxpLmFwcGVuZENoaWxkKGNvbW1lbnRzKTtcblxuICByZXR1cm4gbGk7XG59XG5cbi8qKlxuICogQWRkIHJlc3RhdXJhbnQgbmFtZSB0byB0aGUgYnJlYWRjcnVtYiBuYXZpZ2F0aW9uIG1lbnVcbiAqL1xuZmlsbEJyZWFkY3J1bWIgPSAocmVzdGF1cmFudD1zZWxmLnJlc3RhdXJhbnQpID0+IHtcbiAgY29uc3QgYnJlYWRjcnVtYiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdicmVhZGNydW1iJyk7XG4gIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICBhLmlubmVySFRNTCA9IHJlc3RhdXJhbnQubmFtZTtcbiAgYS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWN1cnJlbnRcIiwgXCJwYWdlXCIpO1xuICBsaS5hcHBlbmRDaGlsZChhKTtcbiAgYnJlYWRjcnVtYi5hcHBlbmRDaGlsZChsaSk7XG59XG5cbi8qKlxuICogIEdldCBhIHBhcmFtZXRlciBieSBuYW1lIGZyb20gcGFnZSBVUkwuXG4gKi9cbmdldFBhcmFtZXRlckJ5TmFtZSA9IChuYW1lLCB1cmwpID0+IHtcbiAgaWYgKCF1cmwpXG4gICAgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gIG5hbWUgPSBuYW1lLnJlcGxhY2UoL1tcXFtcXF1dL2csICdcXFxcJCYnKTtcbiAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKGBbPyZdJHtuYW1lfSg9KFteJiNdKil8JnwjfCQpYCksXG4gICAgcmVzdWx0cyA9IHJlZ2V4LmV4ZWModXJsKTtcbiAgaWYgKCFyZXN1bHRzKVxuICAgIHJldHVybiBudWxsO1xuICBpZiAoIXJlc3VsdHNbMl0pXG4gICAgcmV0dXJuICcnO1xuICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdHNbMl0ucmVwbGFjZSgvXFwrL2csICcgJykpO1xufVxuXG4vKipcbiAqIFNlbmQgcmV2aWV3LlxuICovXG5cbnNlbmRSZXZpZXcgPSAoKSA9PiB7XG5cdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdGNvbnN0IHJlc3RhdXJhbnRfaWQgPSBnZXRQYXJhbWV0ZXJCeU5hbWUoXCJpZFwiKTtcblx0Y29uc3QgbmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbmFtZVwiKS52YWx1ZTtcblx0Y29uc3QgcmF0aW5nID0gcGFyc2VJbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JhdGluZyBvcHRpb246Y2hlY2tlZCcpLnZhbHVlKTtcblx0Y29uc3QgY29tbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbW1lbnRcIikudmFsdWU7XG5cdGNvbnN0IGRhdGEgPSB7XG5cdFx0cmVzdGF1cmFudF9pZDogcGFyc2VJbnQocmVzdGF1cmFudF9pZCksXG5cdFx0bmFtZTogbmFtZSxcblx0XHRyYXRpbmc6IHJhdGluZyxcblx0XHRjb21tZW50czogY29tbWVudHMsXG4gICAgY3JlYXRlZEF0OiBEYXRlLm5vdygpLFxuICAgIHVwZGF0ZWRBdDogRGF0ZS5ub3coKVxuXHR9O1xuXHREQkhlbHBlci5zZW5kUmV2aWV3KGRhdGEpXG4gIC50aGVuKHJlc3BvbnNlID0+IHtcblx0XHRsZXQgcmV2aWV3TGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmV2aWV3cy1saXN0XCIpO1xuXHRcdHJldmlld0xpc3QuaW5zZXJ0QmVmb3JlKGNyZWF0ZVJldmlld0hUTUwoZGF0YSksIHJldmlld0xpc3QuZmlyc3RDaGlsZCk7XG5cdH0pLmNhdGNoKGVyciA9PiB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGVycik7XG5cdFx0XHRsZXQgcmV2aWV3TGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmV2aWV3cy1saXN0XCIpO1xuXHRcdFx0cmV2aWV3TGlzdC5pbnNlcnRCZWZvcmUoY3JlYXRlUmV2aWV3SFRNTChkYXRhLCB0cnVlKSwgcmV2aWV3TGlzdC5maXJzdENoaWxkKTtcblx0XHRcdERCSGVscGVyLmNhY2hlUmV2aWV3KGRhdGEpO1xuXHRcdH0pO1xuXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmV2aWV3LWZvcm1cIikucmVzZXQoKTtcbn1cblxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbmQtcmV2aWV3JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzZW5kUmV2aWV3KTtcblxuXG4vKipcbiAqIFNob3cgbWFwIGFmdGVyIG9uY2xpY2sgZXZlbnRcbiAqL1xuZnVuY3Rpb24gc2hvd01hcCgpIHtcbiAgY29uc3QgbXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1hcFwiKTtcbiAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYXAtYnV0dG9uXCIpO1xuICBtcC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICBidXR0b24uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xufVxuIl0sImZpbGUiOiJyZXN0YXVyYW50X2luZm8uanMifQ==
