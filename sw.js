// sw.js
const CACHE_NAME = 'target1900-cache-v1';

// オフラインで使うために保存するファイル一覧
const FILES_TO_CACHE = [
  './',
  './index.html',
  './data.js',
  './quiz.js',
  './card.js',
  './spelling.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
  // ※他にCSSファイルや画像等があればここに追加してください
];

// インストール時にファイルをキャッシュに保存
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 古いキャッシュの削除処理
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// オフライン時はキャッシュからファイルを返す
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // キャッシュにあればそれを返し、なければネットワークから取得
      return response || fetch(event.request);
    })
  );
});
