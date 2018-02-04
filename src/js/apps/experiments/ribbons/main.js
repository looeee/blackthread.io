import pointerPos from './utilities/pointerPos.js';

import App from './App/App.js';

import { createGroup1, createGroup2, createGroup3, createGroup4 } from './components/lineGroups.js';

class Main {

  constructor() {

    const self = this;

    this.app = new App( document.querySelector( '#canvas' ) );

    this.app.renderer.setClearColor( 0xffffff );
    this.app.camera.position.set( 0, 0, 1 );
    this.app.camera.fov = 75;
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
