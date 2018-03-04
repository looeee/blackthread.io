import HTMLControl from '../HTMLControl.js';

const originalError = console.warn.bind( console );

console.error = ( msg ) => {

  HTMLControl.messages.classList.remove( 'hide' );
  HTMLControl.errorsContainer.classList.remove( 'hide' );
  const p = document.createElement( 'p' );
  p.innerHTML = msg;
  HTMLControl.warnings.append( p );

  originalError( msg );

};

const originalWarn = console.warn.bind( console );

console.warn = ( msg ) => {

  HTMLControl.messages.classList.remove( 'hide' );
  HTMLControl.warningsContainer.classList.remove( 'hide' );
  const p = document.createElement( 'p' );
  p.innerHTML = msg;
  HTMLControl.warnings.append( p );

  originalWarn( msg );

};

const originalLog = console.log.bind( console );

console.log = ( msg ) => {

  HTMLControl.messages.classList.remove( 'hide' );
  HTMLControl.logsContainer.classList.remove( 'hide' );
  const p = document.createElement( 'p' );
  p.innerHTML = msg;
  HTMLControl.logs.append( p );

  originalLog( msg );

};
