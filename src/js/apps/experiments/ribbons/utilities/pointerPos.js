const pointerPos = {

  x: 0,
  y: 0,

};

const moveHandler = ( e ) => {

  e.preventDefault();

  if ( e.type === 'touchmove' ) {

    pointerPos.x = e.changedTouches[ 0 ].pageX;
    pointerPos.y = e.changedTouches[ 0 ].pageY;

  } else {

    pointerPos.x = e.pageX;
    pointerPos.y = e.pageY;

  }

};

// Set up event listeners for touch and mouse

window.addEventListener( 'mousemove', moveHandler );
window.addEventListener( 'touchmove', moveHandler );

export default pointerPos;
