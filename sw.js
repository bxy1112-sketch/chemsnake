// 原来是 v3，改成 v4 或者其他数字
const CACHE_NAME = 'chemsnake-v4-fix';
// 🎒 离线背包清单：必须把所有用到的文件都写在这里
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',       // 必须要有的图标
  './bgm.mp3',        // 背景音乐
  './eat.mp3',        // 音效
  './die.mp3',        // 音效
  './click.mp3',      // 音效
  './win.mp3'         // 音效
];

self.addEventListener('install', event => {
  // 安装时：强制跳过等待，立刻让新背包生效
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('缓存失败，请检查文件名是否写错:', err);
      })
  );
});

self.addEventListener('activate', event => {
  // 激活时：立即接管页面
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 1. 如果背包里有，直接给（秒开，不用网）
        if (response) {
          return response;
        }
        // 2. 如果背包里没有，再去网上找
        return fetch(event.request);
      })
  );
});