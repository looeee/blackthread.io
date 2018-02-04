// append an input elem to a cell in a table row

export default class CellInputElem {

  constructor( row, cell, min, max, text ) {

    const span = document.createElement( 'span' );
    span.innerHTML = text[0].toUpperCase() + text.substr( 1, text.length ) + ': ';

    const input = document.createElement( 'input' );

    input.type = 'number';
    input.min = min;
    input.max = max;
    input.step = 1;
    input.value = '';

    span.appendChild( input );
    cell.appendChild( span );

    input.addEventListener( 'mousedown', () => {

      row.click();

    } );

    return input;

  }

}
