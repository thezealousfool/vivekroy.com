wickedElements.define('.nav-link', {
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
    onhandleRoute: function (event) {
        xhr()
    }
});
