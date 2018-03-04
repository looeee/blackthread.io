import './utilities/logging.js';
import './components/fullscreen.js';
import HTMLControl from './HTMLControl.js';
import './components/fileReader.js';
import Viewer from './components/Viewer.js';


THREE.Cache.enabled = true;

class Main {

  constructor( originalCanvas, resultCanvas ) {

    this.originalPreview = new Viewer( originalCanvas );
    this.resultPreview = new Viewer( resultCanvas );

  }

}

const main = new Main( HTMLControl.originalCanvas, HTMLControl.resultCanvas );

export default main;
