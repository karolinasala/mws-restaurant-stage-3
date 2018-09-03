const version = "0.3.0";
const cacheName = `restaurant-${version}`;
const imagesToCache = [
  `img/1.jpg`,
  `img/2.jpg`,
  `img/3.jpg`,
  `img/4.jpg`,
  `img/5.jpg`,
  `img/6.jpg`,
  `img/7.jpg`,
  `img/8.jpg`,
  `img/9.jpg`,
  `img/10.jpg`,
  `img/icon.png`,
  `img/icon64.png`,
  `img/icon192.png`,
  `img/icon512.png`,
  `img/undefined.jpg`
];
self.addEventListener('install', e => {
  console.log('Service worker installing');
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('Opened cache');
      return cache.addAll([
        `/`,
        `/index.html`,
        `/restaurant.html`,
        `/css/styles.css`,
        `/js/idb.js`,
        `/js/register.js`,
        `/js/dbhelper.js`,
        `/js/main.js`,
        `/js/restaurant_info.js`,
        ...imagesToCache
      ])
          .then(() => self.skipWaiting());
    })
  );
});

self.addEventListener("activate", event => {
  console.log('Service worker activating');
	event.waitUntil(
		caches.keys()
			.then(cacheList => {
				Promise.all(
					cacheList.filter(cacheItem => {
						return cacheItem.startsWith("restaurant-review") &&
                cacheItem !== cacheName;
					}).map(cacheItem => {
						return caches.delete(cacheItem);
					}));
			})
	);
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;
         var fetchRequest =  event.request.clone();
         return fetch(fetchRequest)
         .then(response => {
             if(!response || response.status !== 200|| response.type !== 'basis') {
               return response;
             }
          var responseToCache = response.clone();
          caches.open(cacheName)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          return response;
        })
      })
      .catch(error => {
        console.log('ServiceWorker' + error)
      })
    );
});
