window.addEventListener('load', function (event) {
    var caches = ['/', '/blog', '/about', '/contact'];
    switch (window.location.pathname) {
        case '/': animate('#home', 'animin'); break;
        case '/about.html': animate('#about', 'animin'); break;
        case '/contact.html': animate('#contact', 'animin'); break;
        case '/blog/': animate('#blog', 'animin'); break;
        default: caches = [];
    };
    document.querySelector('.route-dispatcher').dispatchEvent(new CustomEvent('cacheRoute', {
        bubbles: false,
        detail: {
            href: caches,
        },
    }));
});

function animate(selector, className) {
    var elem = document.querySelector(selector);
    if (elem) {
        elem.classList.add(className);
    }
}
