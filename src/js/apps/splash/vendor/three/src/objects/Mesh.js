
import { Object3D } from '../core/Object3D.js';
import { DoubleSide, BackSide, TrianglesDrawMode } from '../constants.js';
import { MeshBasicMaterial } from '../materials/MeshBasicMaterial.js';
import { BufferGeometry } from '../core/BufferGeometry.js';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 * @author jonobr1 / http://jonobr1.com/
 */

function Mesh( geometry, material ) {

  Object3D.call( this );

	this.type = 'Mesh';

	this.geometry = geometry !== undefined ? geometry : new BufferGeometry();
	this.material = material !== undefined ? material : new MeshBasicMaterial( { color: Math.random() * 0xffffff } );

	this.drawMode = TrianglesDrawMode;

	this.updateMorphTargets();

}

Mesh.prototype = Object.assign( Object.create( Object3D.prototype ), {

	constructor: Mesh,

	isMesh: true,

	setDrawMode: function ( value ) {

		this.drawMode = value;

	},

	copy: function ( source ) {

		Object3D.prototype.copy.call( this, source );

		this.drawMode = source.drawMode;

		if ( source.morphTargetInfluences !== undefined ) {

			this.morphTargetInfluences = source.morphTargetInfluences.slice();

		}

		if ( source.morphTargetDictionary !== undefined ) {

			this.morphTargetDictionary = Object.assign( {}, source.morphTargetDictionary );

		}

		return this;

	},

	updateMorphTargets: function () {

		var geometry = this.geometry;
		var m, ml, name;

		if ( geometry.isBufferGeometry ) {

			var morphAttributes = geometry.morphAttributes;
			var keys = Object.keys( morphAttributes );

			if ( keys.length > 0 ) {

				var morphAttribute = morphAttributes[ keys[ 0 ] ];

				if ( morphAttribute !== undefined ) {

					this.morphTargetInfluences = [];
					this.morphTargetDictionary = {};

					for ( m = 0, ml = morphAttribute.length; m < ml; m ++ ) {

						name = morphAttribute[ m ].name || String( m );

						this.morphTargetInfluences.push( 0 );
						this.morphTargetDictionary[ name ] = m;

					}

				}

			}

		} else {

			var morphTargets = geometry.morphTargets;

			if ( morphTargets !== undefined && morphTargets.length > 0 ) {

				this.morphTargetInfluences = [];
				this.morphTargetDictionary = {};

				for ( m = 0, ml = morphTargets.length; m < ml; m ++ ) {

					name = morphTargets[ m ].name || String( m );

					this.morphTargetInfluences.push( 0 );
					this.morphTargetDictionary[ name ] = m;

				}

			}

		}

	},

	clone: function () {

		return new this.constructor( this.geometry, this.material ).copy( this );

	}

} );


export { Mesh };
