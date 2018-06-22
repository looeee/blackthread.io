import HTMLControl from '../HTMLControl.js';

const switchMaterialToBasic = ( object ) => {

  if ( !object.material ) return;

  const oldMat = object.material;

  if ( Array.isArray( oldMat ) ) {

    const newMat = [];

    oldMat.forEach( ( mat ) => {

      newMat.push( new THREE.MeshBasicMaterial( {
        alphaMap: mat.alphaMap,
        color: mat.color,
        // envMap: mat.envMap,
        map: mat.map,
        morphTargets: mat.morphTargets,
        reflectivity: mat.reflectivity,
        // refractionRatio: mat.refractionRatio,
        skinning: mat.skinning,
        specularMap: mat.specularMap,
      } ) );

    } );

    object.material = newMat;

  } else {

    object.material = new THREE.MeshBasicMaterial( {
      alphaMap: oldMat.alphaMap,
      color: oldMat.color,
      // envMap: oldMat.envMap,
      map: oldMat.map,
      morphTargets: oldMat.morphTargets,
      reflectivity: oldMat.reflectivity,
      // refractionRatio: oldMat.refractionRatio,
      skinning: oldMat.skinning,
      specularMap: oldMat.specularMap,
    } );

  }

};
export default class Lighting {

  constructor( app ) {

    this.app = app;

    this.initLights();
    this.initSlider();
    this.initUnlitToggle();

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

  initUnlitToggle() {

    HTMLControl.lighting.unlitToggle.addEventListener( 'click', ( e ) => {

      e.preventDefault();
      this.app.loadedObjects.traverse( ( child ) => {

        if ( child.isMesh ) {
          switchMaterialToBasic( child );
        }

      } );

    }, false );


  }

  reset( ) {

    this.light.intensity = this.initialStrength;
    HTMLControl.lighting.slider.value = String( this.light.intensity );

  }

}
