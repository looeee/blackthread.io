import TextCell from './HTML/TextCell.js';
import DeleteButtonCell from './HTML/DeleteButtonCell.js';

import animationControl from '../animation/animationControl.js';

export default class Group {

  constructor( num, frames ) {

    this.type = 'group';

    this.frames = frames;
    this.robot = frames.robot;

    this.valid = false;

    this.num = num;

    this.initTableRow();

    this.initAddFrameButton();

    this._selected = false;

  }

  set selected( bool ) {

    if ( this._selected === bool ) return;

    if ( bool === true ) {

      this.row.classList.add( 'selected' );

      this.createAnimation();
      animationControl.play();
      this._selected = true;

    } else {

      this.row.classList.remove( 'selected' );
      this._selected = false;

    }

  }

  initTableRow() {

    this.row = document.createElement( 'tr' );

    new TextCell( this.row, this.num + 1 );
    const framesCell = new TextCell( this.row, '<h4>Frames in Group</h4>' );

    this.addFrameButton = document.createElement( 'button' );
    this.addFrameButton.classList.add( 'add-selected-frame-button' );
    this.addFrameButton.innerHTML = 'Add Selected Frame';

    framesCell.appendChild( this.addFrameButton );

    const frameTable = document.createElement( 'table' );
    this.framesInGroup = document.createElement( 'tbody' );
    this.framesInGroup.classList.add( 'frames-in-group' );

    frameTable.appendChild( this.framesInGroup );
    framesCell.appendChild( frameTable );

    this.resetButton = new DeleteButtonCell( this.row, 'Remove all frames from group' );
    this.resetButton.onClick = () => this.reset();

  }

  addFrame( frame ) {

    const row = document.createElement( 'tr' );
    row.dataset.frameNumber = frame.num;

    this.framesInGroup.appendChild( row );

    new TextCell( row, 'Frame #' + ( frame.num + 1 ) );

    const deleteButton = new DeleteButtonCell( row );

    deleteButton.onClick = () => {

      if ( this.framesInGroup.contains( row ) ) {

        this.framesInGroup.removeChild( row );

      }

      if ( this.lastAddedFrameNum === frame.num ) {

        this.lastAddedFrameNum = null;

      }

      this.createAnimation();

    };

    this.selected = true;

  }

  initAddFrameButton() {

    this.lastAddedFrameNum = null;

    this.addFrameButton.addEventListener( 'click', ( e ) => {

      e.preventDefault();

      const frame = this.frames.frames[ this.frames.selectedFrameNum ];

      if ( frame === undefined || frame === null ) return;

      this.lastAddedFrameNum = frame;

      this.addFrame( frame );

      this.createAnimation();
      animationControl.play();

    } );

  }

  getFrames() {

    const frames = [];

    this.framesInGroup.childNodes.forEach( ( node ) => {

      if ( node.nodeName === 'TR' ) {

        frames.push( this.frames.frames[ node.dataset.frameNumber ] );

      }

    } );

    return frames;

  }

  createAnimation() {

    animationControl.createAnimation( this.getFrames() );

  }

  reset() {

    while ( this.framesInGroup.firstChild ) {

      this.framesInGroup.removeChild( this.framesInGroup.firstChild );

    }

    animationControl.reset();
    this.selected = false;

  }

  fromJSON( object ) {

    this.reset();

    for ( const key in object ) {

      const detail = object[ key ];

      this.addFrame( this.frames.frames[ parseInt( detail.frameNum )] );

    }

    this.createAnimation();

  }

  toJSON() {

    const output = {};

    let i = 0;

    this.framesInGroup.childNodes.forEach( ( node ) => {

      if ( node.nodeName === 'TR' ) {

        output[ i ] = {

          frameNum: node.dataset.frameNumber,

        };

        i++;

      }

    } );

    return output;

  }

}
