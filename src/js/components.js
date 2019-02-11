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
                detail: event.detail,
            });
            elem.dispatchEvent(newEvent);
        }
    }
});

wickedElements.define('.route-handler', {
    onconnected: function(event) {
        window.onpopstate = (function (event) {
            this.onhandleRoute({
                detail: {
                    href: event.target.location.pathname,
                    to: event.state.to,
                    get: event.state.get,
                },
                push: false,
            }, false);
        }).bind(this);
    },
    onhandleRoute: function (event) {
        if (event.push)
            this.loadView(event.detail, event.push);
        else
            this.loadView(event.detail, true);
    },
    loadView: function(detail, push) {
        var xhr = new XMLHttpRequest();
        xhr.onload = (function(event) {
            var newDoc = event.target.response;
            var newNode = newDoc.querySelector(detail.get);
            var oldNode = document.querySelector(detail.get);
            if (!oldNode || !newNode) return;
            oldNode.parentNode.replaceChild(newNode, oldNode);
            if (push) {
                history.replaceState({
                    to: detail.to,
                    get: detail.get,
                }, null, window.location.pathname);
                history.pushState({
                    to: detail.to,
                    get: detail.get,
                }, null, detail.href);
            }
            this.el.dispatchEvent(new CustomEvent('routeChanged', {
                bubbles: false,
                detail: {
                    href: detail.href,
                    to: detail.to,
                    get: detail.get,
                    doc: newDoc,
                },
            }));
        }).bind(this);
        xhr.responseType = 'document';
        xhr.open('GET', detail.href);
        xhr.send();
    },
});
