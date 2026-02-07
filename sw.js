// Service Worker для PWA
const CACHE_NAME = 'gosuslugi-v1';
const urlsToCache = [
  './',
  './index.html',
  './load.html',
  './udo.html',
  './zayav.html',
  './index1.html',
  './style.css',
  './style1.css',
  './manifest.json'
];

// Установка Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Активация и очистка старых кэшей
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Стратегия кэширования: сначала сеть, потом кэш
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Клонируем ответ, чтобы положить в кэш и отдать
        const responseClone = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseClone);
          });
        return response;
      })
      .catch(() => {
        return caches.match(event.request)
          .then(response => {
            return response || caches.match('./index.html');
          });
      })
  );
});