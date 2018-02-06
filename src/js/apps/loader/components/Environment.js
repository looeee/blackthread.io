import HTMLControl from '../HTMLControl.js';

export default class Environment {

  constructor( materials ) {

    this.materials = materials;

    this.loadMaps();
    this.initButton();

  }

  loadMaps() {

    this.maps = [];

    const textureLoader = new THREE.TextureLoader();
    const mapA = textureLoader.load( '/images/textures/env_maps/test_env_map.jpg' );
    mapA.mapping = THREE.EquirectangularReflectionMapping;
    mapA.magFilter = THREE.LinearFilter;
    mapA.minFilter = THREE.LinearMipMapLinearFilter;

    this.maps.push( mapA );

    const r = '/images/textures/cube_maps/Bridge2/';
    const urls = [ r + 'posx.jpg', r + 'negx.jpg',
      r + 'posy.jpg', r + 'negy.jpg',
      r + 'posz.jpg', r + 'negz.jpg' ];

    const mapB = new THREE.CubeTextureLoader().load( urls );
    mapB.format = THREE.RGBFormat;
    mapB.mapping = THREE.CubeReflectionMapping;

    this.maps.push( mapB );

  }

  initButton() {

    let mapNum = 0;

    HTMLControl.controls.toggleEnvironment.addEventListener( 'click', ( e ) => {

      e.preventDefault();

      const map = this.maps[ mapNum % this.maps.length ];

      mapNum++;

      this.materials.forEach( ( material ) => {

        if ( material.reflectivity !== undefined ) material.reflectivity = 0.5;
        if ( material.envMapIntensity !== undefined ) material.envMapIntensity = 0.5;
        if ( material.envMap !== undefined ) material.envMap = map;
        material.needsUpdate = true;

      } );

    } );

  }

  default() {

    this.materials.forEach( ( material ) => {

      if ( material.reflectivity !== undefined ) material.reflectivity = 0.25;
      if ( material.envMapIntensity !== undefined ) material.envMapIntensity = 0.25;
      if ( material.envMap !== undefined ) material.envMap = this.maps[ 0 ];
      material.needsUpdate = true;

    } );

  }

}
