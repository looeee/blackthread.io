import HTMLControl from '../HTMLControl.js';
import main from '../main.js';
import loaders from './Loaders.js';

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

const saveArrayBuffer = ( buffer, filename ) => {

  save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );

};

const stringByteLength = ( str ) => {
  // returns the byte length of an utf8 string
  let s = str.length;
  for ( let i = str.length - 1; i >= 0; i-- ) {
    const code = str.charCodeAt( i );
    if ( code > 0x7f && code <= 0x7ff ) s++;
    else if ( code > 0x7ff && code <= 0xffff ) s += 2;
    if ( code >= 0xDC00 && code <= 0xDFFF ) i--; // trail surrogate
  }

  return s;

}

class ExportGLTF {

  constructor() {

    this.loader = loaders.gltfLoader;

    this.exporter = new THREE.GLTFExporter();
    this.initExportButton();
    this.initOptionListeners();

  }

  getOptions() {

    const options = {
      trs: HTMLControl.controls.trs.checked,
      onlyVisible: HTMLControl.controls.onlyVisible.checked,
      truncateDrawRange: HTMLControl.controls.truncateDrawRange.checked,
      binary: HTMLControl.controls.binary.checked,
      embedImages: HTMLControl.controls.embedImages.checked,
      animations: HTMLControl.controls.animations.checked,
      forceIndices: true, // facebook compatibility
      forcePowerOfTwoTextures: true, // facebook compatibility
    };

    if ( options.animations && this.animations.length > 0 ) options.animations = this.animations;

    return options;

  }

  setInput( input, animations ) {

    this.input = input;
    this.animations = animations;
    this.parse();

  }

  parse() {

    this.exporter.parse( this.input, ( result ) => {

      this.result = result;
      // console.log( typeof result )
      this.processResult( result );

    }, this.getOptions() );

  }

  loadPreview() {

    main.resultPreview.reset();

    const promise = loaders.gltfLoader( this.output, true );

    promise.then( ( gltf ) => {

      HTMLControl.loading.result.overlay.classList.add( 'hide' );
      HTMLControl.controls.exportGLTF.disabled = false;

      if ( gltf.scenes.length > 1 ) {

        gltf.scenes.forEach( ( scene ) => {

          if ( gltf.animations ) scene.animations = gltf.animations;
          main.resultPreview.addObjectToScene( scene );

        } );

      } else if ( gltf.scene ) {

        if ( gltf.animations ) gltf.scene.animations = gltf.animations;
        main.resultPreview.addObjectToScene( gltf.scene );

      }

    } ).catch( ( err ) => {

      console.log( err );
      HTMLControl.loading.result.overlay.classList.remove( 'hide' );
      HTMLControl.controls.exportGLTF.disabled = true;

    } );

  }
  processResult() {

    this.setOutput();
    this.loadPreview();

  }

  updateInfo( byteLength ) {

    const type = HTMLControl.controls.binary.checked ? 'GLB' : 'GLTF';

    if ( byteLength < 1000000 ) {

      HTMLControl.controls.exportGLTF.value = 'Export as ' + type + ' (' + Math.ceil( byteLength * 0.001 ) + 'kb)';

    } else {

      HTMLControl.controls.exportGLTF.value = 'Export as ' + type + ' (' + ( byteLength * 1e-6 ).toFixed( 3 ) + 'mb)';

    }

  }

  setOutput() {

    if ( this.result instanceof ArrayBuffer ) {

      this.output = this.result;
      this.updateInfo( this.result.byteLength );

    } else {

      this.output = JSON.stringify( this.result, null, 2 );
      this.updateInfo( stringByteLength( this.output ) );

    }
  }

  save() {

    if ( this.output instanceof ArrayBuffer ) {

      saveArrayBuffer( this.result, 'scene.glb' );

    } else {

      saveString( this.output, 'scene.gltf' );

    }

  }
  initExportButton() {

    HTMLControl.controls.exportGLTF.addEventListener( 'click', ( e ) => {

      e.preventDefault();

      if ( this.output ) this.save( this.output );

    } );

  }

  initOptionListeners() {

    const onOptionChange = ( e ) => {

      e.preventDefault();

      if ( this.input === undefined ) return;

      this.parse();

    };

    HTMLControl.controls.trs.addEventListener( 'change', onOptionChange, false );
    HTMLControl.controls.onlyVisible.addEventListener( 'change', onOptionChange, false );
    HTMLControl.controls.truncateDrawRange.addEventListener( 'change', onOptionChange, false );
    HTMLControl.controls.binary.addEventListener( 'change', onOptionChange, false );
    HTMLControl.controls.embedImages.addEventListener( 'change', onOptionChange, false );
    HTMLControl.controls.animations.addEventListener( 'change', onOptionChange, false );

  }

}

export default new ExportGLTF();