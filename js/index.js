// index.js
import { init } from './main.js';

// Start the game
window.onload = init;

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/service-worker.js")
            .then(() => console.log("Service Worker enregistré !"))
            .catch((error) => console.log("Erreur SW : ", error));
    });
}
