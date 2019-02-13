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
    init: function (event) {
        this.el = event.currentTarget;
        this.views = {};
        this.views[window.location.pathname] = document.cloneNode(true);
    },
    onconnected: function (event) {
        window.onpopstate = (function (event) {
            var newEvent = new CustomEvent('route', {
                bubbles: false,
                detail: {
                    href: event.target.location.pathname,
                    to: event.state.to,
                    get: event.state.get,
                    push: false,
                }
            });
            this.el.dispatchEvent(newEvent);
        }).bind(this);
    },
    onroute: function (event) {
        var elem = this.el.querySelector(event.detail.to);
        if (elem) {
            event.preventDefault();
            var push = event.detail.push !== undefined ? event.detail.push : true;
            if (event.detail.href in this.views) {
                this.dispatchEvent(elem, event.detail, push);
            } else {
                this.xhr(elem, event.detail, push);
            }
        }
    },
    oncacheRoute: function (event) {
        event.detail.href.forEach(href => this.xhr(null, { href }, false, true));
    },
    xhr: function (elem, detail, push, cache) {
        cache = cache | false;
        if (detail.href in this.views) {
            if (!cache)
                this.dispatchEvent(elem, event.detail, push);
            return;
        }
        var xhr = new XMLHttpRequest();
        xhr.onload = (function (event) {
            this.views[detail.href] = event.target.response;
            if (!cache)
                this.dispatchEvent(elem, detail, push);
        }).bind(this);
        xhr.responseType = 'document';
        xhr.open('GET', detail.href);
        xhr.send();
    },
    dispatchEvent: function (elem, detail, push) {
        if (push) {
            window.history.replaceState({
                to: detail.to,
                get: detail.get,
            }, null, window.location.pathname);
            window.history.pushState({
                to: detail.to,
                get: detail.get,
            }, null, detail.href);
        }
        elem.dispatchEvent(new CustomEvent('beforeHandleRoute', {
            bubbles: false,
            detail: {
                href: detail.href,
                to: detail.to,
                get: detail.get,
                doc: this.views[detail.href],
            }
        }));
    },
});

wickedElements.define('.route-handler', {
    onhandleRoute: function (event) {
        var newDoc = event.detail.doc;
        var newNode = newDoc.querySelector(event.detail.get);
        var oldNode = document.querySelector(event.detail.get);
        if (!oldNode || !newNode) return;
        var newNodeClone = newNode.cloneNode(true)
        oldNode.parentNode.replaceChild(newNodeClone, oldNode);
        var scripts = newDoc.querySelectorAll('script');
        for (var i = 0; i < scripts.length; i++) {
            var scriptsrc = scripts[i].getAttribute('src');
            if (scriptsrc) {
                if (!document.querySelector(`script[src="${scriptsrc}"]`)) {
                    console.log('loading', scriptsrc);
                    var newScript = document.createElement('script');
                    newScript.setAttribute('src', scriptsrc);
                    document.head.appendChild(newScript);
                }
            }
        }
    },
});
