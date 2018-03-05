this.main = this.main || {};
(function () {
'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var Masthead = function () {
    function Masthead() {
        classCallCheck(this, Masthead);


        this.masthead = document.querySelector('.masthead');

        if (this.masthead === null) return;

        this.visibleLinks = this.masthead.querySelector('.visible-links');
        this.hiddenLinks = this.masthead.querySelector('.hidden-links');
        this.toggleButton = this.masthead.querySelector('.toggle-links');
        this.spacer = this.masthead.querySelector('#spacer');

        this.setupResize();
        this.setupButton();

        this.decreaseSize();
        this.decreaseSize();

        this.initScroll();
    }

    createClass(Masthead, [{
        key: 'initScroll',
        value: function initScroll() {

            var self = this;
            document.addEventListener('scroll', function () {

                if (window.scrollY > 50) {
                    self.masthead.classList.add('shrink');
                } else {
                    self.masthead.classList.remove('shrink');
                }
            });
        }
    }, {
        key: 'visibleLinksWidth',
        value: function visibleLinksWidth() {

            var width = 0;

            for (var child in this.visibleLinks.children) {

                if (Object.prototype.hasOwnProperty.call(this.visibleLinks.children, child)) {

                    if (this.visibleLinks.children[child].id !== this.spacer) width += this.visibleLinks.children[child].offsetWidth;
                }
            }

            return width;
        }
    }, {
        key: 'increaseSize',
        value: function increaseSize() {

            this.spacer.style.width = 0;

            if (this.hiddenLinks.children.length === 0) {

                this.hiddenLinks.classList.add('fold');
                this.setSpacerWidth();
                return;
            }

            var width = this.visibleLinksWidth() + this.hiddenLinks.firstChild.offsetWidth;

            while (this.hiddenLinks.children.length > 0 && width < this.masthead.clientWidth) {

                width += this.hiddenLinks.firstChild.offsetWidth;
                this.visibleLinks.insertBefore(this.hiddenLinks.firstChild, this.visibleLinks.lastChild);
            }

            this.showButton();
            this.setSpacerWidth();
        }
    }, {
        key: 'decreaseSize',
        value: function decreaseSize() {

            this.spacer.style.width = 0;

            while (this.masthead.clientWidth < this.visibleLinks.scrollWidth) {

                if (this.visibleLinks.children.length === 3) {

                    this.showButton();
                    this.setSpacerWidth();
                    return;
                }

                var secondLastChild = this.visibleLinks.children[this.visibleLinks.children.length - 2];
                this.hiddenLinks.insertBefore(secondLastChild, this.hiddenLinks.firstChild);
            }

            this.showButton();
            this.setSpacerWidth();
        }
    }, {
        key: 'setSpacerWidth',
        value: function setSpacerWidth() {

            this.spacer.style.width = this.visibleLinks.offsetWidth - this.visibleLinksWidth() + 'px';
        }
    }, {
        key: 'showButton',
        value: function showButton() {

            if (this.hiddenLinks.children.length === 0) this.toggleButton.classList.add('hide');else this.toggleButton.classList.remove('hide');
        }
    }, {
        key: 'setupResize',
        value: function setupResize() {

            var self = this;
            var lastWidth = window.innerWidth;

            window.addEventListener('resize', function () {

                if (window.innerWidth > lastWidth) self.increaseSize();else if (window.innerWidth < lastWidth) self.decreaseSize();

                lastWidth = window.innerWidth;
            });
        }
    }, {
        key: 'setupButton',
        value: function setupButton() {

            var self = this;

            var folded = true;

            this.toggleButton.addEventListener('click', function () {

                if (folded) self.hiddenLinks.classList.remove('fold');else self.hiddenLinks.classList.add('fold');

                folded = !folded;
            });
        }
    }]);
    return Masthead;
}();

new Masthead();

var sidenav = function sidenav() {

  var content = document.querySelector('#main');
  var toggleButton = document.querySelector('#toggle-nav');
  var nav = document.querySelector('#vert-nav');

  if (content === null || toggleButton === null || nav === null) return;

  var breakpoint = 1280;

  function updateMenu() {

    if (content.offsetWidth < breakpoint) {

      if (!toggleButton.classList.contains('hide')) return;
      toggleButton.classList.remove('hide');
      nav.classList.add('fold');
    } else {

      if (toggleButton.classList.contains('hide')) return;
      toggleButton.classList.add('hide');
      nav.classList.remove('fold');
    }
  }

  updateMenu();

  toggleButton.addEventListener('click', function (e) {

    e.preventDefault();

    nav.classList.toggle('fold');
  });

  window.addEventListener('resize', updateMenu);
};

sidenav();

}());
