class Masthead {

  constructor() {

    this.masthead = document.querySelector( '.masthead' );

    if ( this.masthead === null ) return;

    this.visibleLinks = this.masthead.querySelector( '.visible-links' );
    this.hiddenLinks = this.masthead.querySelector( '.hidden-links' );
    this.toggleButton = this.masthead.querySelector( '.toggle-links' );
    this.spacer = this.masthead.querySelector( '#spacer' );

    this.setupResize();
    this.setupButton();

    this.decreaseSize();
    this.decreaseSize();

    this.initScroll();

  }

  initScroll() {

    const self = this;
    document.addEventListener( 'scroll', () => {

      if ( window.scrollY > 50 ) {
        self.masthead.classList.add( 'shrink' );
      } else {
        self.masthead.classList.remove( 'shrink' );
      }

    } );

  }

  visibleLinksWidth() {

    let width = 0;

    for ( const child in this.visibleLinks.children ) {

      if ( Object.prototype.hasOwnProperty.call( this.visibleLinks.children, child ) ) {

        if ( this.visibleLinks.children[ child ].id !== this.spacer ) width += this.visibleLinks.children[ child ].offsetWidth;

      }

    }

    return width;

  }

  increaseSize() {

    this.spacer.style.width = 0;

    if ( this.hiddenLinks.children.length === 0 ) {

      this.hiddenLinks.classList.add( 'fold' );
      this.setSpacerWidth();
      return;

    }

    let width = this.visibleLinksWidth() + this.hiddenLinks.firstChild.offsetWidth;

    while (
      this.hiddenLinks.children.length > 0 &&
      width < this.masthead.clientWidth
    ) {

      width += this.hiddenLinks.firstChild.offsetWidth;
      this.visibleLinks.insertBefore( this.hiddenLinks.firstChild, this.visibleLinks.lastChild );


    }

    this.showButton();
    this.setSpacerWidth();

  }

  decreaseSize() {

    this.spacer.style.width = 0;

    while ( this.masthead.clientWidth < this.visibleLinks.scrollWidth ) {

      if ( this.visibleLinks.children.length === 3 ) {

        this.showButton();
        this.setSpacerWidth();
        return;

      }

      const secondLastChild = this.visibleLinks.children[ this.visibleLinks.children.length - 2 ];
      this.hiddenLinks.insertBefore( secondLastChild, this.hiddenLinks.firstChild );

    }

    this.showButton();
    this.setSpacerWidth();

  }

  setSpacerWidth() {

    this.spacer.style.width = this.visibleLinks.offsetWidth - this.visibleLinksWidth() + 'px';

  }

  showButton() {

    if ( this.hiddenLinks.children.length === 0 ) this.toggleButton.classList.add( 'hide' );
    else this.toggleButton.classList.remove( 'hide' );

  }

  setupResize() {

    const self = this;
    let lastWidth = window.innerWidth;

    window.addEventListener( 'resize', () => {

      if ( window.innerWidth > lastWidth ) self.increaseSize();
      else if ( window.innerWidth < lastWidth ) self.decreaseSize();

      lastWidth = window.innerWidth;
    } );

  }

  setupButton() {

    const self = this;

    let folded = true;

    this.toggleButton.addEventListener( 'click', () => {

      if ( folded ) self.hiddenLinks.classList.remove( 'fold' );
      else self.hiddenLinks.classList.add( 'fold' );

      folded = !folded;

    } );


  }

}

new Masthead();
