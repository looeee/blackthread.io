// Append a cell containing a reset button to a table row

export default class ResetButtonCell {

  constructor( row ) {

    const deleteButtonCell = document.createElement( 'td' );
    this.button = document.createElement( 'button' );
    this.button.innerHTML = '<span class="fa fa-lg fa-undo" aria-hidden="true"></span>';
    deleteButtonCell.appendChild( this.button );
    row.appendChild( deleteButtonCell );

    this.onClick = () => {};

    this.click = ( e ) => {

      if ( e ) e.preventDefault();

      this.onClick();

    };

    this.button.addEventListener( 'click', this.click );

  }

  set disabled( value ) {

    this.button.disabled = true;

  }

}
