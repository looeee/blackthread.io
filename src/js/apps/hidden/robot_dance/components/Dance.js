import HTMLControl from '../HTMLControl.js';
import TextCell from './HTML/TextCell.js';
import DeleteButtonCell from './HTML/DeleteButtonCell.js';
import LoopInputCell from './HTML/LoopInputCell.js';
import animationControl from '../animation/animationControl.js';

export default class Dance {

  constructor( groups ) {

    this.groups = groups;
    this.frames = groups.frames;
    this.robot = this.frames.robot;

    this.valid = false;

    this.lastAddedType = null;
    this.table = HTMLControl.controls.dance.table;

    this.initAdvancedControls();
    this.initAddSelectedFrameButton();
    this.initAddSelectedGroupButton();
    this.initDanceButton();
    this.initResetButton();
    this.initFramerateInput();
    this.onDanceFinish();

  }

  set framerate( value ) {

    animationControl.framerate = value;

    this.calculateTime();

  }

  calculateTime() {

    const value = parseFloat( HTMLControl.controls.dance.advancedControlInput.value );

    const time = this.calculateTotalFrames() * animationControl.framerate;

    if ( value === time ) {

      this.correctTimeCalculated = true;

      HTMLControl.controls.dance.advancedControlInput.style.backgroundColor = 'aquamarine';

    } else {

      this.correctTimeCalculated = false;

      HTMLControl.controls.dance.advancedControlInput.style.backgroundColor = '#ffaaaa';

    }

  }

  initAdvancedControls() {

    this.advancedControlsEnabled = false;
    this.correctTimeCalculated = false;

    HTMLControl.controls.dance.advancedControlToggle.addEventListener( 'change', ( e ) => {

      e.preventDefault();

      if ( !this.advancedControlsEnabled ) {

        HTMLControl.controls.dance.advancedControlSection.classList.remove( 'hide' );

      } else {

        HTMLControl.controls.dance.advancedControlSection.classList.add( 'hide' );

      }

      this.advancedControlsEnabled = !this.advancedControlsEnabled;

      this.checkDanceIsValid();

    } );

    HTMLControl.controls.dance.advancedControlInput.addEventListener( 'input', ( e ) => {

      e.preventDefault();

      this.calculateTime();

    } );

  }

  add( elem, loop ) {

    const loopAmount = loop || 1;

    const row = document.createElement( 'tr' );
    row.dataset.type = elem.type;
    row.dataset.loops = loopAmount;
    row.dataset.number = elem.num;

    this.table.appendChild( row );

    new TextCell( row, elem.type );
    new TextCell( row, elem.num );

    if ( elem.type === 'group' ) {

      const loopInput = new LoopInputCell( row, loop );

      loopInput.onInput = ( value ) => {

        row.dataset.loops = value;
        this.checkDanceIsValid();

      };

    } else {

      row.appendChild( document.createElement( 'td' ) );

    }

    const deleteButton = new DeleteButtonCell( row );

    deleteButton.onClick = () => {

      if ( this.table.contains( row ) ) this.table.removeChild( row );

      if ( elem.type === 'group' && elem.num === this.lastAddedGroupNum ) this.lastAddedGroupNum = -1;
      if ( elem.type === 'frame' && elem.num === this.lastAddedFrameNum ) this.lastAddedFrameNum = -1;

      this.checkDanceIsValid();

    };

    this.checkDanceIsValid();
    HTMLControl.controls.dance.resetButton.disabled = false;

  }

  initAddSelectedFrameButton() {

    this.lastAddedFrameNum = null;

    HTMLControl.controls.dance.addFrameButton.addEventListener( 'click', ( e ) => {

      e.preventDefault();

      const frame = this.frames.frames[ this.frames.selectedFrameNum ];
      this.groups.deselectAll();
      animationControl.reset();

      if ( frame === null || ( frame.num === this.lastAddedFrameNum && this.lastAddedType === 'frame' ) ) return;

      this.add( frame );

      this.lastAddedFrameNum = frame.num;
      this.lastAddedType = 'frame';


    } );

  }

  initAddSelectedGroupButton() {

    this.lastAddedGroupNum = null;

    HTMLControl.controls.dance.addGroupButton.addEventListener( 'click', ( e ) => {

      e.preventDefault();

      const group = this.groups.selectedGroup;
      this.groups.deselectAll();
      animationControl.reset();

      if ( group === null || ( group.num === this.lastAddedGroupNum && this.lastAddedType === 'group' ) ) return;

      this.add( group );

      this.lastAddedGroupNum = group.num;
      this.lastAddedType = 'group';

    } );

  }

  initFramerateInput() {

    HTMLControl.controls.dance.framerate.addEventListener( 'input', ( e ) => {

      this.groups.deselectAll();
      this.framerate = e.target.value;

    } );

  }

  setFramerate( rate ) {

    if ( rate < 0.1 || rate > 10 ) {

      console.warn( 'Attempting to set frame rate outside of allowed range [0.1, 10]!' );
      rate = 1;

    }

    HTMLControl.controls.dance.framerate.value = rate;
    this.framerate = rate;

  }

  onDanceFinish() {

    animationControl.onFinish = () => {

      HTMLControl.controls.music.stop.click();
      HTMLControl.controls.dance.playSymbol.classList.remove( 'fa-stop' );
      HTMLControl.controls.dance.playSymbol.classList.add( 'fa-play' );
      this.robot.reset();

    };

  }

  initDanceButton() {

    const play = () => {

      this.groups.deselectAll();
      animationControl.reset();
      this.createAnimation();
      animationControl.play();

      HTMLControl.controls.music.stop.click();
      HTMLControl.controls.music.play.click();

      HTMLControl.controls.dance.playSymbol.classList.remove( 'fa-play' );
      HTMLControl.controls.dance.playSymbol.classList.add( 'fa-stop' );


    };

    const stop = () => {

      animationControl.reset();
      HTMLControl.controls.music.stop.click();

      HTMLControl.controls.dance.playSymbol.classList.remove( 'fa-stop' );
      HTMLControl.controls.dance.playSymbol.classList.add( 'fa-play' );


    };

    HTMLControl.controls.dance.playButton.addEventListener( 'click', ( e ) => {

      e.preventDefault();

      if ( HTMLControl.controls.dance.playSymbol.classList.contains( 'fa-play' ) !== -1 ) {

        if ( this.advancedControlsEnabled && !this.correctTimeCalculated ) {

          /* eslint no-alert: 0 */
          alert( 'Hint: multiply the frame rate by the total number of frames in the dance' );

        } else {

          play();

        }

      } else stop();

    } );

  }

  initResetButton() {

    HTMLControl.controls.dance.resetButton.addEventListener( 'click', ( e ) => {

      e.preventDefault();

      this.groups.deselectAll();
      animationControl.reset();
      this.reset();

    } );

  }

  createAnimation() {

    let frames = [];

    this.table.childNodes.forEach( ( node ) => {

      if ( node.nodeName === 'TR' ) {

        const num = node.dataset.number;

        if ( node.dataset.type === 'group' ) {

          for ( let i = 0; i < node.dataset.loops; i++ ) {

            frames = frames.concat( this.groups.groups[ num ].getFrames() );

          }

        } else {

          frames.push( this.frames.frames[ num ] );

        }

      }

    } );

    this.actions = animationControl.createAnimation( frames );

  }

  calculateTotalFrames() {

    let totalFrames = 0;

    this.table.childNodes.forEach( ( node ) => {

      if ( node.nodeName === 'TR' ) {

        const num = node.dataset.number;

        if ( node.dataset.type === 'group' ) {

          for ( let i = 0; i < node.dataset.loops; i++ ) {

            totalFrames += this.groups.groups[ num ].getFrames().length;

          }

        } else {

          totalFrames++;

        }

      }

    } );

    return totalFrames;

  }

  checkDanceIsValid() {

    // dance is valid if there are 2 or more frames
    this.valid = this.calculateTotalFrames() > 1;

    HTMLControl.controls.dance.playButton.disabled = !this.valid;

    HTMLControl.controls.dance.advancedControlInput.placeholder = this.valid ? '0.0' : 'Not enough frames in dance!';

  }

  reset() {

    while ( this.table.firstChild ) {

      this.table.removeChild( this.table.firstChild );

    }


    this.valid = false;
    HTMLControl.controls.dance.playButton.disabled = true;
    HTMLControl.controls.dance.resetButton.disabled = true;
    this.framerate = 1;

    this.lastAddedGroupNum = -1;
    this.lastAddedFrameNum = -1;

    HTMLControl.controls.dance.playSymbol.classList.add( 'fa-play' );
    HTMLControl.controls.dance.playSymbol.classList.remove( 'fa-stop' );

  }

  fromJSON( object ) {

    this.reset();

    this.setFramerate( object.framerate || 1 );

    for ( const key in object ) {

      const value = object[ key ];

      if ( value.type === 'frame' ) {

        this.add( this.frames.frames[ value.num ] );

      } else if ( value.type === 'group' ) {

        this.add( this.groups.groups[ value.num ], value.loopAmount );

      } else if ( key === 'framerate' ) {

        HTMLControl.controls.dance.framerate.value = value;

      }

    }

  }

  toJSON() {

    const output = {

      framerate: this.framerate,

    };

    let i = 0;

    this.table.childNodes.forEach( ( node ) => {

      if ( node.nodeName === 'TR' ) {

        output[ i ] = {

          type: node.dataset.type,
          num: node.dataset.number,
          loopAmount: node.dataset.loops,

        };

        i++;

      }

    } );

    return output;

  }

}
