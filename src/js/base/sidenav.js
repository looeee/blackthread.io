const sidenav = function () {

  const content = document.querySelector( '#main' );
  const toggleButton = document.querySelector( '#toggle-nav' );
  const nav = document.querySelector( '#vert-nav' );

  if ( content === null || toggleButton === null || nav === null ) return;

  const breakpoint = 1280;

  function updateMenu() {

    if ( content.offsetWidth < breakpoint ) {

      if ( !toggleButton.classList.contains( 'hide' ) ) return;
      toggleButton.classList.remove( 'hide' );
      nav.classList.add( 'fold' );

    } else {

      if ( toggleButton.classList.contains( 'hide' ) ) return;
      toggleButton.classList.add( 'hide' );
      nav.classList.remove( 'fold' );

    }

  }

  updateMenu();

  toggleButton.addEventListener( 'click', ( e ) => {

    e.preventDefault();

    nav.classList.toggle( 'fold' );

  } );

  window.addEventListener( 'resize', updateMenu );

};

sidenav();
