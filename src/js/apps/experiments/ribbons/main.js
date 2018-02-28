import pointerPos from './utilities/pointerPos.js';

import App from './App/App.js';

import { createGroup1, createGroup2, createGroup3, createGroup4, createLineGroup } from './components/lineGroups.js';

class Main {

  constructor() {

    const self = this;

    this.app = new App( document.querySelector( '#canvas' ) );

    this.app.renderer.setClearColor( 0xffffff );
    this.app.camera.position.set( 0, 0, 1 );
    this.app.camera.fov = 75;
    this.app.camera.near = 0.1;
    this.app.camera.far = 50;
    this.app.camera.updateProjectionMatrix();

    self.mixers = [];

    self.app.onUpdate = function () {

      self.animateCamera();

      self.mixers.forEach( mixer => mixer.update( self.app.delta * 0.0005 ) );

    };

    self.initLines();

    self.app.play();
  }

  initLines() {
    const spec = {
      camera: this.app.camera,
      z: 10,
      color: 0xff00ff,
      numLines: 18,
      initialGapSize: 0.1,
      finalGapSize: 0.5,
      initialThickness: 0.1,
      finalThickness: 0.1,
      seed: 0.1,
      animLength: 5,
    };

    const g1 = createLineGroup( spec );

    // this.app.scene.add( g1.group );
    // this.mixers.push( g1.mixer );

    const groups = [
      createGroup1( this.app.camera ),
      createGroup2( this.app.camera ),
      createGroup3( this.app.camera ),
      createGroup4( this.app.camera ),
    ];
    groups.forEach( ( group ) => {
      this.app.scene.add( group.group );
      this.mixers.push( group.mixer );
    } );
  }

  animateCamera() {

    const speed = 0.01;

    const endPos = pointerPos.y / window.innerHeight;

    const distance = Math.abs( this.app.camera.position.y - endPos );

    if ( this.app.camera.position.y - endPos < 0.04 ) this.app.camera.position.y += distance * speed;
    else if ( this.app.camera.position.y - endPos > 0.04 ) this.app.camera.position.y -= distance * speed;

  }

}

export default new Main();
