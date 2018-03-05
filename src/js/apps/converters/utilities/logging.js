import HTMLControl from '../HTMLControl.js';

const originalError = console.warn.bind( console );

function log() {

  const args = Array.prototype.slice.call( arguments );
  const rep = args.slice( 1, args.length );
  let i = 0;

  const output = args[0].replace( /%s/g, ( match, idx ) => {
    const subst = rep.slice( i, ++i );
    return ( subst );
  } );
  return output;
}
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
