if (!("serviceWorker" in navigator)) {
    console.log("ServiceWorker isn't support to this browser");
} else {
    window.addEventListener("load", function() {
        registerServiceWorker();
    });
}

function registerServiceWorker() {
    return navigator.serviceWorker
        .register("/sw.js")
        .then(function(registration) {
            return registration;
        })
        .catch(function(err) {
            console.err(err);
        });
}

document.addEventListener("DOMContentLoaded", function() {
    let pages = window.location.hash.substr(1);
    if (pages == "home" || pages == "") {
        getStanding();
    } else if (pages == "match") {
        getMatch();
    } else if (pages == "team") {
        getTeam();
    }
});