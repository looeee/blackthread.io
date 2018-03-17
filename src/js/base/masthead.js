const priorityNav = {}; // Object for public APIs
const breaks = []; // Object to store instances with breakpoints where the instances menu item"s didin"t fit.
let settings = {};
let mainNavWrapper;
let totalWidth;
let restWidth;
let mainNav;
let navDropdown;
let navDropdownToggle;
let dropDownWidth;
let toggleWrapper;
let viewportWidth = 0;


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

// Check if dropdown menu is already on page before creating it
const prepareHtml = function ( wrapper, settings ) {

  toggleWrapper = document.querySelector( '.hidden-links-wrapper' );
  navDropdown = document.querySelector( '.hidden-links' );
  navDropdownToggle = document.querySelector( '.toggle-links' );

  // // Create dropdown menu
  // toggleWrapper = document.createElement( 'span' );
  // navDropdown = document.createElement( 'ul' );
  // navDropdownToggle = document.createElement( 'button' );


  // // Set label for dropdown toggle
  // navDropdownToggle.innerHTML = settings.navDropdownLabel;

  // // Set aria attributes for accessibility
  // navDropdownToggle.setAttribute( 'aria-controls', 'menu' );
  // navDropdownToggle.setAttribute( 'type', 'button' );
  // navDropdown.setAttribute( 'aria-hidden', 'true' );


  // // Move elements to the right spot
  // if ( wrapper.querySelector( mainNav ).parentNode !== wrapper ) {
  //   console.warn( 'PriorityNav: mainNav is not a direct child of mainNavWrapper, double check please' );
  //   return;
  // }

  // wrapper.insertAfter( toggleWrapper, wrapper.querySelector( mainNav ) );

  // toggleWrapper.appendChild( navDropdownToggle );
  // toggleWrapper.appendChild( navDropdown );

  // navDropdown.classList.add( settings.navDropdownClassName );
  // navDropdown.classList.add( 'priority-nav__dropdown' );

  // navDropdownToggle.classList.add( 'fa' );
  // navDropdownToggle.classList.add( 'fa-bars' );
  // navDropdownToggle.classList.add( settings.navDropdownToggleClassName );
  // navDropdownToggle.classList.add( 'priority-nav__dropdown-toggle' );

  // toggleWrapper.classList.add( settings.navDropdownClassName + '-wrapper' );
  // toggleWrapper.classList.add( 'priority-nav__wrapper' );

  // wrapper.classList.add( 'priority-nav' );
};

// Get innerwidth without padding
const getElementContentWidth = function ( element ) {
  const styles = window.getComputedStyle( element );
  const padding = parseFloat( styles.paddingLeft ) +
        parseFloat( styles.paddingRight );

  return element.clientWidth - padding;
};

const viewportSize = function () {
  const doc = document;
  const w = window;
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

// Get width
const calculateWidths = function ( wrapper ) {
  totalWidth = getElementContentWidth( wrapper );

  // Check if parent is the navwrapper before calculating its width
  if ( wrapper.querySelector( navDropdown ).parentNode === wrapper ) {
    dropDownWidth = wrapper.querySelector( navDropdown ).offsetWidth;
  } else {
    dropDownWidth = 0;
  }
  restWidth = getChildrenWidth( wrapper ) + settings.offsetPixels;
  viewportWidth = viewportSize().width;
};


// Move item to array
priorityNav.doesItFit = ( wrapper ) => {

  // Update width
  calculateWidths( wrapper );

  // Keep executing until all menu items that are overflowing are moved
  while ( totalWidth <= restWidth && wrapper.querySelector( mainNav ).children.length > 0 || viewportWidth < settings.breakPoint && wrapper.querySelector( mainNav ).children.length > 0 ) {
    // move item to dropdown
    priorityNav.toDropdown( wrapper );
    // recalculate widths
    calculateWidths( wrapper );
  }

  // Keep executing until all menu items that are able to move back are moved
  while ( totalWidth >= breaks[breaks.length - 1] && viewportWidth > settings.breakPoint ) {
    // move item to menu
    priorityNav.toMenu( wrapper );
  }

  // If there are no items in dropdown hide dropdown
  if ( breaks.length < 1 ) {
    wrapper.querySelector( navDropdown ).classList.remove( 'show' );
  }

  // If there are no items in menu
  if ( wrapper.querySelector( mainNav ).children.length < 1 ) {
    // show navDropdownBreakpointLabel
    wrapper.classList.add( 'is-empty' );
  } else {
    wrapper.classList.remove( 'is-empty' );
  }

  // Check if we need to show toggle menu button
  showToggle( wrapper );
};


// Show/hide toggle button
const showToggle = ( wrapper ) => {
  if ( breaks.length < 1 ) {
    wrapper.querySelector( navDropdownToggle ).classList.add( 'priority-nav-is-hidden' );
    wrapper.querySelector( navDropdownToggle ).classList.remove( 'priority-nav-is-visible' );
    wrapper.classList.remove( 'priority-nav-has-dropdown' );

    // Set aria attributes for accessibility
    wrapper.querySelector( '.priority-nav__wrapper' ).setAttribute( 'aria-haspopup', 'false' );

  } else {
    wrapper.querySelector( navDropdownToggle ).classList.add( 'priority-nav-is-visible' );
    wrapper.querySelector( navDropdownToggle ).classList.remove( 'priority-nav-is-hidden' );
    wrapper.classList.add( 'priority-nav-has-dropdown' );

    // Set aria attributes for accessibility
    wrapper.querySelector( '.priority-nav__wrapper' ).setAttribute( 'aria-haspopup', 'true' );
  }
};

// Move item to dropdown
priorityNav.toDropdown = function ( wrapper ) {

  //* move last child of navigation menu to dropdown
  if ( wrapper.querySelector( navDropdown ).firstChild && wrapper.querySelector( mainNav ).children.length > 0 ) {
    wrapper.querySelector( navDropdown ).insertBefore( wrapper.querySelector( mainNav ).lastElementChild, wrapper.querySelector( navDropdown ).firstChild );
  } else if ( wrapper.querySelector( mainNav ).children.length > 0 ) {
    wrapper.querySelector( navDropdown ).appendChild( wrapper.querySelector( mainNav ).lastElementChild );
  }

  // store breakpoints
  breaks.push( restWidth );

  // check if we need to show toggle menu button
  showToggle( wrapper );

  //  If item has been moved to dropdown trigger the callback
  settings.moved();
};


// Move item to menu
priorityNav.toMenu = function ( wrapper ) {
  // / move last child of navigation menu to dropdown
  if ( wrapper.querySelector( navDropdown ).children.length > 0 ) wrapper.querySelector( mainNav ).appendChild( wrapper.querySelector( navDropdown ).firstElementChild );

  // remove last breakpoint
  breaks.pop();

  // Check if we need to show toggle menu button
  showToggle( wrapper );

  settings.movedBack();
};

const getChildrenWidth = ( e ) => {
  const children = e.childNodes;
  let sum = 0;
  for ( let i = 0; i < children.length; i++ ) {
    if ( children[i].nodeType !== 3 ) {
      if ( !Number.isNaN( children[i].offsetWidth ) ) {
        sum += children[i].offsetWidth;
      }

    }
  }
  return sum;
};

const listeners = function ( wrapper, settings ) {

  // Check if an item needs to move
  if ( window.attachEvent ) {
    window.attachEvent( 'onresize', () => {
      if ( priorityNav.doesItFit )priorityNav.doesItFit( wrapper );
    } );
  } else if ( window.addEventListener ) {
    window.addEventListener( 'resize', () => {
      if ( priorityNav.doesItFit )priorityNav.doesItFit( wrapper );
    }, true );
  }

  // Toggle dropdown
  wrapper.querySelector( navDropdownToggle ).addEventListener( 'click', function () {
    wrapper.querySelector( navDropdown ).classList.toggle( 'show' );
    this.classList.toggle( 'is-open' );
    wrapper.classList.toggle( 'is-open' );

    // Toggle aria hidden for accessibility
    if ( wrapper.className.indexOf( 'is-open' ) !== -1 ) {
      wrapper.querySelector( navDropdown ).setAttribute( 'aria-hidden', 'false' );
    } else {
      wrapper.querySelector( navDropdown ).setAttribute( 'aria-hidden', 'true' );
      wrapper.querySelector( navDropdown ).blur();
    }
  } );

  // Remove when clicked outside dropdown
  document.addEventListener( 'click', ( event ) => {
    if ( !getClosest( event.target, '.' + settings.navDropdownClassName ) && event.target !== wrapper.querySelector( navDropdownToggle ) ) {
      wrapper.querySelector( navDropdown ).classList.remove( 'show' );
      wrapper.querySelector( navDropdownToggle ).classList.remove( 'is-open' );
      wrapper.classList.remove( 'is-open' );
    }
  } );

  // Remove when escape key is pressed
  document.onkeydown = function ( evt ) {
    evt = evt || window.event;
    if ( evt.keyCode === 27 ) {
      document.querySelector( navDropdown ).classList.remove( 'show' );
      document.querySelector( navDropdownToggle ).classList.remove( 'is-open' );
      mainNavWrapper.classList.remove( 'is-open' );
    }
  };
};

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

if ( typeof Node !== 'undefined' ) {
  Node.prototype.insertAfter = function ( n, r ) { this.insertBefore( n, r.nextSibling ); };
}

const checkForSymbols = function ( string ) {
  const firstChar = string.charAt( 0 );
  if ( firstChar === '.' || firstChar === '#' ) {
    return false;
  }
  return true;

};

priorityNav.init = function ( options ) {

  settings = options;

  const wrapper = document.querySelector( settings.mainNavWrapper );

  if ( !wrapper ) {
    console.warn( "PriorityNav: couldn't find the specified mainNavWrapper element" );
    return;
  }

  mainNav = settings.mainNav;
  if ( !wrapper.querySelector( mainNav ) ) {
    console.warn( "PriorityNav: couldn't find the specified mainNav element" );
    return;
  }

  prepareHtml( wrapper, settings );

  navDropdown = '.' + settings.navDropdownClassName;
  if ( !document.querySelector( navDropdown ) ) {
    console.warn( "PriorityNav: couldn't find the specified navDropdown element" );
    return;
  }

  navDropdownToggle = '.' + settings.navDropdownToggleClassName;
  if ( !wrapper.querySelector( navDropdownToggle ) ) {
    console.warn( "PriorityNav: couldn't find the specified navDropdownToggle element" );
    return;
  }

  listeners( wrapper, settings );

  priorityNav.doesItFit( wrapper );

  document.documentElement.classList.add( settings.initClass );
};

const options = {
  initClass: 'js-priorityNav', // Class that will be printed on html element to allow conditional css styling.
  mainNavWrapper: '#masthead-nav', // mainnav wrapper selector (must be direct parent from mainNav)
  mainNav: 'ul', // mainnav selector. (must be inline-block)
  navDropdownClassName: 'hidden-links', // class used for the dropdown.
  navDropdownToggleClassName: 'toggle-links', // class used for the dropdown toggle.
  navDropdownLabel: '', // Text that is used for the dropdown toggle.
  navDropdownBreakpointLabel: '', // button label for navDropdownToggle when the breakPoint is reached.
  breakPoint: 50, // amount of pixels when all menu items should be moved to dropdown to simulate a mobile menu
  throttleDelay: 50, // this will throttle the calculating logic on resize because i'm a responsible dev.
  offsetPixels: 0, // increase to decrease the time it takes to move an item.
  count: true, // prints the amount of items are moved to the attribute data-count to style with css counter.

  // Callbacks
  moved() {
  },
  movedBack() {
  },
};

const onLoad = () => {

  priorityNav.init( options );
  window.removeEventListener( 'load', onLoad );

};

window.addEventListener( 'load', onLoad );

// set up scroll listener to shrink masthead on scroll
const masthead = document.querySelector( '#masthead' );
document.addEventListener( 'scroll', () => {

  if ( window.scrollY > 50 ) {
    masthead.classList.add( 'shrink' );
  } else {
    masthead.classList.remove( 'shrink' );
  }

} );
