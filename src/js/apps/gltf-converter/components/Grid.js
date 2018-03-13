import HTMLControl from '../HTMLControl.js';

export default class Grid {

  constructor( app ) {

    this.app = app;

    this.size = 0;

    this.gridHelper = new THREE.GridHelper();
    this.axesHelper = new THREE.AxesHelper();

    this.helpers = new THREE.Group();

    this.helpers.add( this.gridHelper, this.axesHelper );
    this.helpers.visible = true;

  }

  setSize() {

    this.size = Math.floor( this.app.camera.far * 0.5 );
    if ( this.size % 2 !== 0 ) this.size++;
    this.updateGrid();
    this.updateAxes();

  }

  updateGrid() {

    const gridHelper = new THREE.GridHelper( this.size, 10 );
    this.helpers.remove( this.gridHelper );
    this.gridHelper = gridHelper;
    this.helpers.add( this.gridHelper );

  }

  updateAxes() {

    const axesHelper = new THREE.AxesHelper( this.size / 2 );
    this.helpers.remove( this.axesHelper );
    this.axesHelper = axesHelper;
    this.helpers.add( this.axesHelper );

  }

}
