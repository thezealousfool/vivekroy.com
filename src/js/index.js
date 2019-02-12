window.addEventListener('load', function (event) {
    var caches = null;
    switch (window.location.pathname) {
        case '/':
        case '/about':
        case '/contact':
        case '/blog': caches = ['/', '/about', '/contact', '/blog']; break;
        default: caches = [];
    };
    document.querySelector('.route-dispatcher').dispatchEvent(new CustomEvent('cacheRoute', {
        bubbles: false,
        detail: {
            href: caches,
        },
    }));
});
