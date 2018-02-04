import HTMLControl from './HTMLControl.js';

// saving function taken from three.js editor
const link = document.createElement( 'a' );
link.style.display = 'none';
document.body.appendChild( link ); // Firefox workaround, see #6594

const save = ( blob, filename ) => {

  link.href = URL.createObjectURL( blob );
  link.download = filename || 'data.json';
  link.click();

};


const saveString = ( text, filename ) => {

  save( new Blob( [ text ], { type: 'text/plain' } ), filename );

};

const exportAsJSON = ( object ) => {

  const output = JSON.stringify( object, null, '\t' );

  saveString( output, 'dance.json' );

};

export default class FileControl {

  constructor( frames, groups, dance ) {

    this.frames = frames;
    this.groups = groups;
    this.dance = dance;

    this.initSaveButton();
    this.initLoadButton();
    this.initExamples();
    this.initResetButton();

  }

  load( json ) {

    if ( !json.metadata || json.metadata.type !== 'Nao Dance File' ) {

      console.error( 'Wrong JSON format - cannot load dance!' );
      return;

    }

    this.resetAll();

    this.frames.fromJSON( json.frames );
    this.groups.fromJSON( json.groups );
    this.dance.fromJSON( json.dance );

  }

  initSaveButton() {

    HTMLControl.controls.file.save.addEventListener( 'click', ( e ) => {

      e.preventDefault();

      const object = {

        metadata: {
          type: 'Nao Dance File',
          generator: 'Blackthread design',
          version: '1',
        },

      };

      object.frames = this.frames.toJSON();
      object.groups = this.groups.toJSON();
      object.dance = this.dance.toJSON();

      exportAsJSON( object );

    } );

  }

  initLoadButton() {

    HTMLControl.controls.file.load.addEventListener( 'click', ( e ) => {

      e.preventDefault();

      HTMLControl.controls.file.fileInput.click();

    } );

    HTMLControl.controls.file.fileInput.addEventListener( 'change', ( e ) => {

      const file = e.target.files[ 0 ];

      const fileReader = new FileReader();

      fileReader.readAsText( file );

      fileReader.onload = ( evt ) => {

        try {

          const json = JSON.parse( evt.target.result );

          this.load( json );


        } catch ( error ) {

          console.error( 'Error while trying to read ' + file.name + ' as JSON: ' + error );

        }
      };

      HTMLControl.controls.file.fileInput.value = '';

    } );
  }

  initResetButton() {

    HTMLControl.controls.file.resetButton.addEventListener( 'click', ( e ) => {

      e.preventDefault();

      /* eslint no-alert: 0 */
      if ( confirm( 'This will reset everything! Are you sure?' ) ) {

        this.resetAll();

      }

    } );

  }

  resetAll() {

    this.frames.reset();
    this.groups.reset();
    this.dance.reset();
    HTMLControl.controls.music.stop.click();

    this.frames.createInitialFrames();
    this.groups.newGroupButton.click();

  }

  initExamples() {

    const examples = HTMLControl.controls.file.examples;

    HTMLControl.controls.file.loadExample.addEventListener( 'click', ( e ) => {

      e.preventDefault();

      const path = '/assets/models/robot_dance/examples/' + examples.options[examples.selectedIndex].value + '.json';

      fetch( path )
        .then( response => response.json() )
        .then( json => this.load( json ) )
        .catch( err => console.log( err ) );

    } );

  }

}
