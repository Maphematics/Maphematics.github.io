self.addEventListener('install', function(event) {
    // Perform install steps
    var CACHE_NAME = 'newCache';
    var urlsToCache = [
  '/',
  'css/blogStyles.css',
  'css/bootstrap.min.css',
  'css/fontawesome-all.min.css',
  'css/magnific-popup.css',
  'css/tooplate-style.css',
  '/sw.js',
  '/manifest.json',
  '/index.html',
  'https://illinoisjo2.weebly.com/',
  '/blog.html',
  '/swag.html'
];
  });

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(newCache)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Cache hit - return response
          if (response) {
            return response;
          }
          return fetch(event.request);
        }
      )
    );
  });

  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Cache hit - return response
          if (response) {
            return response;
          }
  
          return fetch(event.request).then(
            function(response) {
              // Check if we received a valid response
              if(!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
  
              // IMPORTANT: Clone the response. A response is a stream
              // and because we want the browser to consume the response
              // as well as the cache consuming the response, we need
              // to clone it so we have two streams.
              var responseToCache = response.clone();
  
              caches.open(CACHE_NAME)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });
  
              return response;
            }
          );
        })
      );
  });

  self.addEventListener('activate', function(event) {

    var cacheAllowlist = ['pages-cache-v1'];
  
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheAllowlist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });