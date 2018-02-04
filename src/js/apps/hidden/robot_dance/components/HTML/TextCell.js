export default class TextCell {

  constructor( row, text ) {

    const textCell = document.createElement( 'td' );
    row.appendChild( textCell );
    textCell.innerHTML = text;

    return textCell;

  }

}
