let cacheName = 'cache';

self.addEventListener('install', (event) => {
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('message', (event) => {
    switch (event.data.type) {
        case 'CACHE_NAME':
            cacheName = event.data.payload;
            break;

        case 'CACHE_URLS':
            event.waitUntil(
                caches.open(cacheName).then((cache) => {
                    return cache.addAll(event.data.payload);
                })
            );
            break;

        default:
            break;
    }
});
