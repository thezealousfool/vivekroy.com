window.addEventListener('load', function (event) {
    var caches = null;
    switch (window.location.pathname) {
        case '/':
        case '/about':
        case '/contact': caches = ['/', '/about', '/contact']; break;
        default: caches = [];
    };
    document.querySelector('.route-dispatcher').dispatchEvent(new CustomEvent('cacheRoute', {
        bubbles: false,
        detail: {
            href: caches,
        },
    }));
});
