try {

  console.log( window.top );

} catch ( e ) {

  const h3 = document.createElement( 'h3' );

  h3.innerHTML = 'Find the complete tutorial at ';
  h3.style.position = 'absolute';
  h3.style.textAlign = 'center';
  h3.style.width = '100%';
  h3.style.color = 'white';


  const a = document.createElement( 'a' );
  h3.appendChild( a );

  a.innerHTML = 'www.blackthreaddesign.com';
  a.href = 'https://www.blackthreaddesign.com/tutorials/';

  a.style.color = 'white';

  document.body.appendChild( h3 );

  const style = document.createElement( 'style' );
  style.innerHTML = 'a:hover{ color: purple !important; }';
  document.querySelector( 'head' ).appendChild( style );

}
