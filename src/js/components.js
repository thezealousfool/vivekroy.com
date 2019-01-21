wickedElements.define('.nav-link', {
    init: function (event) {
        this.el = event.currentTarget;
    },
    onclick: function (event) {
        if (!(this.el.hasAttribute('forward')
            || !this.el.hasAttribute('href')
            || !this.el.hasAttribute('to'))) {
            event.preventDefault();
            var newEvent = new CustomEvent('route', {
                bubbles: true,
                detail: {
                    href: this.el.getAttribute('href'),
                    to: this.el.getAttribute('to'),
                    get: this.el.getAttribute('get') || this.el.getAttribute('to'),
                }
            });
            this.el.dispatchEvent(newEvent);
        }
    }
});

wickedElements.define('.route-dispatcher', {
    init: function (event) {
        this.el = event.currentTarget;
    },
    onroute: function (event) {
        var elem = this.el.querySelector(event.detail.to);
        if (elem) {
            event.preventDefault();
            var newEvent = new CustomEvent('handleRoute', {
                bubbles: false,
                detail: {
                    href: event.detail.href,
                    get: event.detail.get,
                }
            });
            elem.dispatchEvent(newEvent);
        }
    }
});

wickedElements.define('.route-handler', {
    init: function (event) {
        this.el = event.currentTarget;
    },
    onhandleRoute: function (event) {
        console.log('Routing to', event.detail.href, ', getting', event.detail.get);
    }
});
