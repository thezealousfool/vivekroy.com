window.addEventListener('load', function (event) {
    document.querySelector('.route-dispatcher').dispatchEvent(new CustomEvent('cacheRoute', {
        bubbles: false,
        detail: {
            href: ['/about.html', '/contact.html', '/'],
        },
    }));
});
