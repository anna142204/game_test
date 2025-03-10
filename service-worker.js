self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("game-cache").then((cache) => {
            return cache.addAll([
                "/",
                "/index.html",
                "/main.js",
                "/assets/chat.png",
                "/assets/coin.png",
                "/assets/case.png",
                "/assets/SourGummy-VariableFont_wdth,wght.ttf"
            ]);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
