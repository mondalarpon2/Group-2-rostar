const CACHE_NAME = 'roster-cache-v2'; // ভার্সন ভি-২ (Cache Version Update)
const urlsToCache = [
  './',
  './index.html'
];

// ১. ইনস্টল হওয়ার সময় ফাইল ক্যাশ করা
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); // নতুন সার্ভিস ওয়ার্কারকে সাথে সাথে একটিভ হতে বাধ্য করা
});

// ২. পুরোনো ক্যাশ বা জঞ্জাল পরিষ্কার করা
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // পেজগুলোর ওপর তাৎক্ষণিক নিয়ন্ত্রণ নেওয়া
});

// ৩. ফেচ বা অফলাইন মোড হ্যান্ডেল করা
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // ক্যাশ পেলে সেটা দেবে, সাথে ব্যাকগ্রাউন্ডে নেটওয়ার্ক থেকে লেটেস্ট ফাইল আনার চেষ্টা করবে
        return response || fetch(event.request);
      })
  );
});
