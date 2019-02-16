window.addEventListener('load', function (event) {
    window.setTimeout(function () {
        document.querySelector('aside').style.display = 'block';
    }, 3000);
    window.setTimeout(function () {
        document.querySelector('aside').style.display = 'none';
    }, 9000);
    var caches = ['/', '/blog/', '/about', '/contact'];
    switch (window.location.pathname) {
        case '/': animate('#home', 'animin'); break;
        case '/about': animate('#about', 'animin'); break;
        case '/contact': animate('#contact', 'animin'); break;
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

function animate(selector, className, duration) {
    var elem = document.querySelector(selector);
    if (elem) {
        elem.classList.add(className);
        window.setTimeout(function () {
            elem.classList.remove(className);
        }, 1500);
    }
}

wickedElements.define('main', {
    onbeforeHandleRoute: function (event) {
        this.el.classList.add('animout');
        this.event = event;
        window.setTimeout((function () {
            this.el.dispatchEvent(new CustomEvent('handleRoute', {
                bubbles: false,
                detail: this.event.detail,
            }));
        }).bind(this), 1000);
    },
    onconnected: function (event) {
        this.el.classList.add('animin');
        window.setTimeout((function () {
            this.el.classList.remove('animin');
        }).bind(this), 1500);
    },
});
