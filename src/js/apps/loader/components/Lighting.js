import HTMLControl from '../HTMLControl.js';

export default class Lighting {

  constructor( app ) {

    this.app = app;

    this.initLights();

    this.initSlider();

    this.initialStrength = 1.2;

    this.reset();
  }

  initLights() {

    const ambientLight = new THREE.AmbientLight( 0xffffff, 0.3 );
    this.app.scene.add( ambientLight );

    this.light = new THREE.PointLight( 0xffffff, this.initialStrength );

    this.app.camera.add( this.light );
    this.app.scene.add( this.app.camera );

  }

  initSlider() {

    HTMLControl.lighting.slider.addEventListener( 'input', ( e ) => {

      e.preventDefault();
      this.light.intensity = HTMLControl.lighting.slider.value;

    }, false );

    HTMLControl.lighting.symbol.addEventListener( 'click', ( e ) => {

      e.preventDefault();
      this.reset();

    }, false );

  }

  reset( ) {

    this.light.intensity = this.initialStrength;
    HTMLControl.lighting.slider.value = String( this.light.intensity );

  }

}
