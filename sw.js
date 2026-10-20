const CACHE_NAME = 'cyberpulse-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Установка и кэширование
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Активация и очистка старого кэша
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
});

// Перехват запросов (сначала сеть, потом кэш)
self.addEventListener('fetch', (e) => {
  // Не кэшируем запросы к Firebase и Render (они должны идти только в сеть)
  if (e.request.url.includes('firebaseio.com') || e.request.url.includes('onrender.com')) return;
  
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
