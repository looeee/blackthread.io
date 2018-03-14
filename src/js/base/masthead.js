// class Masthead {

//   constructor() {

//     this.masthead = document.querySelector( '.masthead' );

//     if ( this.masthead === null ) return;

//     this.visibleLinks = this.masthead.querySelector( '.visible-links' );
//     this.hiddenLinks = this.masthead.querySelector( '.hidden-links' );
//     this.toggleButton = this.masthead.querySelector( '.toggle-links' );
//     this.spacer = this.masthead.querySelector( '#spacer' );

//     this.setupResize();
//     this.setupButton();

//     this.decreaseSize();
//     this.decreaseSize();

//     this.initScroll();

//   }

//   initScroll() {

//     const self = this;
//     document.addEventListener( 'scroll', () => {

//       if ( window.scrollY > 50 ) {
//         self.masthead.classList.add( 'shrink' );
//       } else {
//         self.masthead.classList.remove( 'shrink' );
//       }

//     } );

//   }

//   visibleLinksWidth() {

//     let width = 0;

//     for ( const child in this.visibleLinks.children ) {

//       if ( Object.prototype.hasOwnProperty.call( this.visibleLinks.children, child ) ) {

//         if ( this.visibleLinks.children[ child ].id !== this.spacer ) width += this.visibleLinks.children[ child ].offsetWidth;

//       }

//     }

//     return width;

//   }

//   increaseSize() {

//     this.spacer.style.width = 0;

//     if ( this.hiddenLinks.children.length === 0 ) {

//       this.hiddenLinks.classList.add( 'fold' );
//       this.setSpacerWidth();
//       return;

//     }

//     let width = this.visibleLinksWidth() + this.hiddenLinks.firstChild.offsetWidth;

//     while (
//       this.hiddenLinks.children.length > 0 &&
//       width < this.masthead.clientWidth
//     ) {

//       width += this.hiddenLinks.firstChild.offsetWidth;
//       this.visibleLinks.insertBefore( this.hiddenLinks.firstChild, this.visibleLinks.lastChild );


//     }

//     this.showButton();
//     this.setSpacerWidth();

//   }

//   decreaseSize() {

//     this.spacer.style.width = 0;

//     while ( this.masthead.clientWidth < this.visibleLinks.scrollWidth ) {

//       if ( this.visibleLinks.children.length === 3 ) {

//         this.showButton();
//         this.setSpacerWidth();
//         return;

//       }

//       const secondLastChild = this.visibleLinks.children[ this.visibleLinks.children.length - 2 ];
//       this.hiddenLinks.insertBefore( secondLastChild, this.hiddenLinks.firstChild );

//     }

//     this.showButton();
//     this.setSpacerWidth();

//   }

//   setSpacerWidth() {

//     this.spacer.style.width = this.visibleLinks.offsetWidth - this.visibleLinksWidth() + 'px';

//   }

//   showButton() {

//     if ( this.hiddenLinks.children.length === 0 ) this.toggleButton.classList.add( 'hide' );
//     else this.toggleButton.classList.remove( 'hide' );

//   }

//   setupResize() {

//     const self = this;
//     let lastWidth = window.innerWidth;

//     window.addEventListener( 'resize', () => {

//       if ( window.innerWidth > lastWidth ) self.increaseSize();
//       else if ( window.innerWidth < lastWidth ) self.decreaseSize();

//       lastWidth = window.innerWidth;
//     } );

//   }

//   setupButton() {

//     const self = this;

//     let folded = true;

//     this.toggleButton.addEventListener( 'click', () => {

//       if ( folded ) self.hiddenLinks.classList.remove( 'fold' );
//       else self.hiddenLinks.classList.add( 'fold' );

//       folded = !folded;

//     } );


//   }

// }

// new Masthead();

( function ( root, factory ) {
  if ( typeof define === 'function' && define.amd ) {
    define( 'priorityNav', factory( root ) );
  } else if ( typeof exports === 'object' ) {
    module.exports = factory( root );
  } else {
    root.priorityNav = factory( root );
  }
}( window || this, ( root ) => {


  /**
   * Variables
   */
  const priorityNav = {}; // Object for public APIs
  const breaks = []; // Object to store instances with breakpoints where the instances menu item"s didin"t fit.
  const supports = !!document.querySelector && !!root.addEventListener; // Feature test
  let settings = {};
  let instance = 0;
  let count = 0;
  let mainNavWrapper, totalWidth, restWidth, mainNav, navDropdown, navDropdownToggle, dropDownWidth, toggleWrapper;
  let viewportWidth = 0;

  /**
   * Default settings
   * @type {{initClass: string, navDropdown: string, navDropdownToggle: string, mainNavWrapper: string, moved: Function, movedBack: Function}}
   */
  const defaults = {
    initClass: 'js-priorityNav', // Class that will be printed on html element to allow conditional css styling.
    mainNavWrapper: '#masthead-nav', // mainnav wrapper selector (must be direct parent from mainNav)
    mainNav: 'ul', // mainnav selector. (must be inline-block)
    navDropdownClassName: 'hidden-links', // class used for the dropdown.
    navDropdownToggleClassName: 'toggle-links', // class used for the dropdown toggle.
    navDropdownLabel: '=', // Text that is used for the dropdown toggle.
    navDropdownBreakpointLabel: '=', // button label for navDropdownToggle when the breakPoint is reached.
    breakPoint: 500, // amount of pixels when all menu items should be moved to dropdown to simulate a mobile menu
    throttleDelay: 50, // this will throttle the calculating logic on resize because i'm a responsible dev.
    offsetPixels: 0, // increase to decrease the time it takes to move an item.
    count: true, // prints the amount of items are moved to the attribute data-count to style with css counter.

    // Callbacks
    moved() {
    },
    movedBack() {
    },
  };


  /**
   * A simple forEach() implementation for Arrays, Objects and NodeLists
   * @private
   * @param {Array|Object|NodeList} collection Collection of items to iterate
   * @param {Function} callback Callback function for each iteration
   * @param {Array|Object|NodeList} scope Object/NodeList/Array that forEach is iterating over (aka `this`)
   */
  const forEach = function ( collection, callback, scope ) {
    if ( Object.prototype.toString.call( collection ) === '[object Object]' ) {
      for ( const prop in collection ) {
        if ( Object.prototype.hasOwnProperty.call( collection, prop ) ) {
          callback.call( scope, collection[prop], prop, collection );
        }
      }
    } else {
      for ( let i = 0, len = collection.length; i < len; i++ ) {
        callback.call( scope, collection[i], i, collection );
      }
    }
  };


  /**
   * Get the closest matching element up the DOM tree
   * @param {Element} elem Starting element
   * @param {String} selector Selector to match against (class, ID, or data attribute)
   * @return {Boolean|Element} Returns false if not match found
   */
  const getClosest = function ( elem, selector ) {
    const firstChar = selector.charAt( 0 );
    for ( ; elem && elem !== document; elem = elem.parentNode ) {
      if ( firstChar === '.' ) {
        if ( elem.classList.contains( selector.substr( 1 ) ) ) {
          return elem;
        }
      } else if ( firstChar === '#' ) {
        if ( elem.id === selector.substr( 1 ) ) {
          return elem;
        }
      } else if ( firstChar === '[' ) {
        if ( elem.hasAttribute( selector.substr( 1, selector.length - 2 ) ) ) {
          return elem;
        }
      }
    }
    return false;
  };


  /**
   * Merge defaults with user options
   * @private
   * @param {Object} defaults Default settings
   * @param {Object} options User options
   * @returns {Object} Merged values of defaults and options
   */
  const extend = function ( defaults, options ) {
    const extended = {};
    forEach( defaults, ( value, prop ) => {
      extended[prop] = defaults[prop];
    } );
    forEach( options, ( value, prop ) => {
      extended[prop] = options[prop];
    } );
    return extended;
  };


  /**
   * Debounced resize to throttle execution
   * @param func
   * @param wait
   * @param immediate
   * @returns {Function}
   */
  function debounce( func, wait, immediate ) {
    let timeout;
    return function () {
      let context = this, args = arguments;
      const later = function () {
        timeout = null;
        if ( !immediate ) func.apply( context, args );
      };
      const callNow = immediate && !timeout;
      clearTimeout( timeout );
      timeout = setTimeout( later, wait );
      if ( callNow ) func.apply( context, args );
    };
  }


  /**
   * Toggle class on element
   * @param el
   * @param className
   */
  const toggleClass = function ( el, className ) {
    if ( el.classList ) {
      el.classList.toggle( className );
    } else {
      const classes = el.className.split( ' ' );
      const existingIndex = classes.indexOf( className );

      if ( existingIndex >= 0 ) { classes.splice( existingIndex, 1 ); } else { classes.push( className ); }

      el.className = classes.join( ' ' );
    }
  };


  /**
   * Check if dropdown menu is already on page before creating it
   * @param mainNavWrapper
   */
  const prepareHtml = function ( _this, settings ) {

    /**
       * Create dropdow menu
       * @type {HTMLElement}
       */
    toggleWrapper = document.createElement( 'span' );
    navDropdown = document.createElement( 'ul' );
    navDropdownToggle = document.createElement( 'button' );

    /**
       * Set label for dropdown toggle
       * @type {string}
       */
    navDropdownToggle.innerHTML = settings.navDropdownLabel;

    /**
       * Set aria attributes for accessibility
       */
    navDropdownToggle.setAttribute( 'aria-controls', 'menu' );
    navDropdownToggle.setAttribute( 'type', 'button' );
    navDropdown.setAttribute( 'aria-hidden', 'true' );


    /**
       * Move elements to the right spot
       */
    if ( _this.querySelector( mainNav ).parentNode !== _this ) {
      console.warn( 'mainNav is not a direct child of mainNavWrapper, double check please' );
      return;
    }

    _this.insertAfter( toggleWrapper, _this.querySelector( mainNav ) );

    toggleWrapper.appendChild( navDropdownToggle );
    toggleWrapper.appendChild( navDropdown );

    /**
       * Add classes so we can target elements
       */
    navDropdown.classList.add( settings.navDropdownClassName );
    navDropdown.classList.add( 'priority-nav__dropdown' );

    navDropdownToggle.classList.add( settings.navDropdownToggleClassName );
    navDropdownToggle.classList.add( 'priority-nav__dropdown-toggle' );

    toggleWrapper.classList.add( settings.navDropdownClassName + '-wrapper' );
    toggleWrapper.classList.add( 'priority-nav__wrapper' );

    _this.classList.add( 'priority-nav' );
  };


  /**
   * Get innerwidth without padding
   * @param element
   * @returns {number}
   */
  const getElementContentWidth = function ( element ) {
    const styles = window.getComputedStyle( element );
    const padding = parseFloat( styles.paddingLeft ) +
          parseFloat( styles.paddingRight );

    return element.clientWidth - padding;
  };


  /**
   * Get viewport size
   * @returns {{width: number, height: number}}
   */
  const viewportSize = function () {
    let doc = document, w = window;
    const docEl = ( doc.compatMode && doc.compatMode === 'CSS1Compat' ) ?
      doc.documentElement : doc.body;

    let width = docEl.clientWidth;
    let height = docEl.clientHeight;

    // mobile zoomed in?
    if ( w.innerWidth && width > w.innerWidth ) {
      width = w.innerWidth;
      height = w.innerHeight;
    }

    return { width, height };
  };


  /**
   * Get width
   * @param elem
   * @returns {number}
   */
  const calculateWidths = function ( _this ) {
    totalWidth = getElementContentWidth( _this );
    // Check if parent is the navwrapper before calculating its width
    if ( _this.querySelector( navDropdown ).parentNode === _this ) {
      dropDownWidth = _this.querySelector( navDropdown ).offsetWidth;
    } else {
      dropDownWidth = 0;
    }
    restWidth = getChildrenWidth( _this ) + settings.offsetPixels;
    viewportWidth = viewportSize().width;
  };


  /**
   * Move item to array
   * @param item
   */
  priorityNav.doesItFit = ( _this ) => {

    /**
       * Check if it is the first run
       */
    var delay = _this.getAttribute( 'instance' ) === 0 ? delay : settings.throttleDelay;

    /**
       * Increase instance
       */
    instance++;

    /**
       * Debounced execution of the main logic
       */
    ( debounce( () => {

      /**
           * Get the current element"s instance
           * @type {string}
           */
      const identifier = _this.getAttribute( 'instance' );

      /**
           * Update width
           */
      calculateWidths( _this );

      /**
           * Keep executing until all menu items that are overflowing are moved
           */
      while ( totalWidth <= restWidth && _this.querySelector( mainNav ).children.length > 0 || viewportWidth < settings.breakPoint && _this.querySelector( mainNav ).children.length > 0 ) {
        // move item to dropdown
        priorityNav.toDropdown( _this, identifier );
        // recalculate widths
        calculateWidths( _this, identifier );
        // update dropdownToggle label
        if ( viewportWidth < settings.breakPoint ) updateLabel( _this, identifier, settings.navDropdownBreakpointLabel );
      }

      /**
           * Keep executing until all menu items that are able to move back are moved
           */
      while ( totalWidth >= breaks[identifier][breaks[identifier].length - 1] && viewportWidth > settings.breakPoint ) {
        // move item to menu
        priorityNav.toMenu( _this, identifier );
        // update dropdownToggle label
        if ( viewportWidth > settings.breakPoint ) updateLabel( _this, identifier, settings.navDropdownLabel );
      }

      /**
           * If there are no items in dropdown hide dropdown
           */
      if ( breaks[identifier].length < 1 ) {
        _this.querySelector( navDropdown ).classList.remove( 'show' );
        // show navDropdownLabel
        updateLabel( _this, identifier, settings.navDropdownLabel );
      }

      /**
           * If there are no items in menu
           */
      if ( _this.querySelector( mainNav ).children.length < 1 ) {
        // show navDropdownBreakpointLabel
        _this.classList.add( 'is-empty' );
        updateLabel( _this, identifier, settings.navDropdownBreakpointLabel );
      } else {
        _this.classList.remove( 'is-empty' );
      }

      /**
           * Check if we need to show toggle menu button
           */
      showToggle( _this, identifier );

    }, delay ) )();
  };


  /**
   * Show/hide toggle button
   */
  const showToggle = ( _this, identifier ) => {
    if ( breaks[identifier].length < 1 ) {
      _this.querySelector( navDropdownToggle ).classList.add( 'priority-nav-is-hidden' );
      _this.querySelector( navDropdownToggle ).classList.remove( 'priority-nav-is-visible' );
      _this.classList.remove( 'priority-nav-has-dropdown' );

      /**
           * Set aria attributes for accessibility
           */
      _this.querySelector( '.priority-nav__wrapper' ).setAttribute( 'aria-haspopup', 'false' );

    } else {
      _this.querySelector( navDropdownToggle ).classList.add( 'priority-nav-is-visible' );
      _this.querySelector( navDropdownToggle ).classList.remove( 'priority-nav-is-hidden' );
      _this.classList.add( 'priority-nav-has-dropdown' );

      /**
           * Set aria attributes for accessibility
           */
      _this.querySelector( '.priority-nav__wrapper' ).setAttribute( 'aria-haspopup', 'true' );
    }
  };


  /**
   * Update count on dropdown toggle button
   */
  const updateCount = function ( _this, identifier ) {
    _this.querySelector( navDropdownToggle ).setAttribute( 'priorityNav-count', breaks[identifier].length );
  };

  const updateLabel = ( _this, identifier, label ) => {
    _this.querySelector( navDropdownToggle ).innerHTML = label;
  };


  /**
   * Move item to dropdown
   */
  priorityNav.toDropdown = function ( _this, identifier ) {


    /**
       * move last child of navigation menu to dropdown
       */
    if ( _this.querySelector( navDropdown ).firstChild && _this.querySelector( mainNav ).children.length > 0 ) {
      _this.querySelector( navDropdown ).insertBefore( _this.querySelector( mainNav ).lastElementChild, _this.querySelector( navDropdown ).firstChild );
    } else if ( _this.querySelector( mainNav ).children.length > 0 ) {
      _this.querySelector( navDropdown ).appendChild( _this.querySelector( mainNav ).lastElementChild );
    }

    /**
       * store breakpoints
       */
    breaks[identifier].push( restWidth );

    /**
       * check if we need to show toggle menu button
       */
    showToggle( _this, identifier );

    /**
       * update count on dropdown toggle button
       */
    if ( _this.querySelector( mainNav ).children.length > 0 && settings.count ) {
      updateCount( _this, identifier );
    }

    /**
       * If item has been moved to dropdown trigger the callback
       */
    settings.moved();
  };


  /**
   * Move item to menu
   */
  priorityNav.toMenu = function ( _this, identifier ) {

    /**
       * move last child of navigation menu to dropdown
       */
    if ( _this.querySelector( navDropdown ).children.length > 0 ) _this.querySelector( mainNav ).appendChild( _this.querySelector( navDropdown ).firstElementChild );

    /**
       * remove last breakpoint
       */
    breaks[identifier].pop();

    /**
       * Check if we need to show toggle menu button
       */
    showToggle( _this, identifier );

    /**
       * update count on dropdown toggle button
       */
    if ( _this.querySelector( mainNav ).children.length > 0 && settings.count ) {
      updateCount( _this, identifier );
    }

    /**
       * If item has been moved back to the main menu trigger the callback
       */
    settings.movedBack();
  };


  /**
   * Count width of children and return the value
   * @param e
   */
  const getChildrenWidth = ( e ) => {
    const children = e.childNodes;
    let sum = 0;
    for ( let i = 0; i < children.length; i++ ) {
      if ( children[i].nodeType !== 3 ) {
        if ( !isNaN( children[i].offsetWidth ) ) {
          sum += children[i].offsetWidth;
        }

      }
    }
    return sum;
  };


  /**
   * Bind eventlisteners
   */
  const listeners = function ( _this, settings ) {

    // Check if an item needs to move
    if ( window.attachEvent ) {
      window.attachEvent( 'onresize', () => {
        if ( priorityNav.doesItFit )priorityNav.doesItFit( _this );
      } );
    } else if ( window.addEventListener ) {
      window.addEventListener( 'resize', () => {
        if ( priorityNav.doesItFit )priorityNav.doesItFit( _this );
      }, true );
    }

    // Toggle dropdown
    _this.querySelector( navDropdownToggle ).addEventListener( 'click', function () {
      toggleClass( _this.querySelector( navDropdown ), 'show' );
      toggleClass( this, 'is-open' );
      toggleClass( _this, 'is-open' );

      /**
           * Toggle aria hidden for accessibility
           */
      if ( _this.className.indexOf( 'is-open' ) !== -1 ) {
        _this.querySelector( navDropdown ).setAttribute( 'aria-hidden', 'false' );
      } else {
        _this.querySelector( navDropdown ).setAttribute( 'aria-hidden', 'true' );
        _this.querySelector( navDropdown ).blur();
      }
    } );

    /*
       * Remove when clicked outside dropdown
       */
    document.addEventListener( 'click', ( event ) => {
      if ( !getClosest( event.target, '.' + settings.navDropdownClassName ) && event.target !== _this.querySelector( navDropdownToggle ) ) {
        _this.querySelector( navDropdown ).classList.remove( 'show' );
        _this.querySelector( navDropdownToggle ).classList.remove( 'is-open' );
        _this.classList.remove( 'is-open' );
      }
    } );

    /**
       * Remove when escape key is pressed
       */
    document.onkeydown = function ( evt ) {
      evt = evt || window.event;
      if ( evt.keyCode === 27 ) {
        document.querySelector( navDropdown ).classList.remove( 'show' );
        document.querySelector( navDropdownToggle ).classList.remove( 'is-open' );
        mainNavWrapper.classList.remove( 'is-open' );
      }
    };
  };


  /**
   * Remove function
   */
  Element.prototype.remove = function () {
    this.parentElement.removeChild( this );
  };

  /* global HTMLCollection */
  NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
    for ( let i = 0, len = this.length; i < len; i++ ) {
      if ( this[i] && this[i].parentElement ) {
        this[i].parentElement.removeChild( this[i] );
      }
    }
  };


  /**
   * Destroy the current initialization.
   * @public
   */
  priorityNav.destroy = function () {
    // If plugin isn"t already initialized, stop
    if ( !settings ) return;
    // Remove feedback class
    document.documentElement.classList.remove( settings.initClass );
    // Remove toggle
    toggleWrapper.remove();
    // Remove settings
    settings = null;
    delete priorityNav.init;
    delete priorityNav.doesItFit;
  };


  /**
   * insertAfter function
   * @param n
   * @param r
   */
  if ( supports && typeof Node !== 'undefined' ) {
    Node.prototype.insertAfter = function ( n, r ) { this.insertBefore( n, r.nextSibling ); };
  }

  const checkForSymbols = function ( string ) {
    const firstChar = string.charAt( 0 );
    if ( firstChar === '.' || firstChar === '#' ) {
      return false;
    }
    return true;

  };


  /**
   * Initialize Plugin
   * @public
   * @param {Object} options User settings
   */
  priorityNav.init = function ( options ) {

    /**
       * Merge user options with defaults
       * @type {Object}
       */
    settings = extend( defaults, options || {} );

    // Feature test.
    if ( !supports && typeof Node === 'undefined' ) {
      console.warn( "This browser doesn't support priorityNav" );
      return;
    }

    // Options check
    if ( !checkForSymbols( settings.navDropdownClassName ) || !checkForSymbols( settings.navDropdownToggleClassName ) ) {
      console.warn( 'No symbols allowed in navDropdownClassName & navDropdownToggleClassName. These are not selectors.' );
      return;
    }

    /**
       * Store nodes
       * @type {NodeList}
       */
    const elements = document.querySelectorAll( settings.mainNavWrapper );

    /**
       * Loop over every instance and reference _this
       */
    forEach( elements, ( _this ) => {

      /**
           * Create breaks array
           * @type {number}
           */
      breaks[count] = [];

      /**
           * Set the instance number as data attribute
           */
      _this.setAttribute( 'instance', count++ );

      /**
           * Store the wrapper element
           */
      mainNavWrapper = _this;
      if ( !mainNavWrapper ) {
        console.warn( "couldn't find the specified mainNavWrapper element" );
        return;
      }

      /**
           * Store the menu elementStore the menu element
           */
      mainNav = settings.mainNav;
      if ( !_this.querySelector( mainNav ) ) {
        console.warn( "couldn't find the specified mainNav element" );
        return;
      }

      /**
           * Check if we need to create the dropdown elements
           */
      prepareHtml( _this, settings );

      /**
           * Store the dropdown element
           */
      navDropdown = '.' + settings.navDropdownClassName;
      if ( !_this.querySelector( navDropdown ) ) {
        console.warn( "couldn't find the specified navDropdown element" );
        return;
      }

      /**
           * Store the dropdown toggle element
           */
      navDropdownToggle = '.' + settings.navDropdownToggleClassName;
      if ( !_this.querySelector( navDropdownToggle ) ) {
        console.warn( "couldn't find the specified navDropdownToggle element" );
        return;
      }

      /**
           * Event listeners
           */
      listeners( _this, settings );

      /**
           * Start first check
           */
      priorityNav.doesItFit( _this );

    } );

    /**
       * Count amount of instances
       */
    instance++;

    /**
       * Add class to HTML element to activate conditional CSS
       */
    document.documentElement.classList.add( settings.initClass );
  };


  /**
   * Public APIs
   */
  return priorityNav;

} ) );

const nav = priorityNav.init();
