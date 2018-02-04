import { AmbientLight, AnimationClip, BufferAttribute, Bone, BufferGeometry, Color, ClampToEdgeWrapping, DefaultLoadingManager, DirectionalLight, Euler, Float32BufferAttribute, Group, EquirectangularReflectionMapping, FileLoader, Line, LineBasicMaterial, LoaderUtils, Math as _Math, Matrix4, Mesh, MeshLambertMaterial, MeshPhongMaterial, OrthographicCamera, Object3D, PerspectiveCamera, PointLight, PropertyBinding, Quaternion, QuaternionKeyframeTrack, RepeatWrapping, Skeleton, SkinnedMesh, SpotLight, TextureLoader, Vector3, Vector4, VectorKeyframeTrack, VertexColors } from '../vendor/three/src/THREE.js';

/**
 * @author Kyle-Larson https://github.com/Kyle-Larson
 * @author Takahiro https://github.com/takahirox
 * @author Lewy Blue https://github.com/looeee
 *
 * Loader loads FBX file and generates Group representing FBX scene.
 * Requires FBX file to be >= 7.0 and in ASCII or to be any version in Binary format.
 *
 * Supports:
 *  Mesh Generation (Positional Data)
 *  Normal Data (Per Vertex Drawing Instance)
 *  UV Data (Per Vertex Drawing Instance)
 *  Skinning
 *  Animation
 *   - Separated Animations based on stacks.
 *   - Skeletal & Non-Skeletal Animations
 *  NURBS (Open, Closed and Periodic forms)
 *
 * Needs Support:
 *	Euler rotation order
 *
 *
 * FBX format references:
 * 	https://wiki.blender.org/index.php/User:Mont29/Foundation/FBX_File_Structure
 *
 * 	Binary format specification:
 *		https://code.blender.org/2013/08/fbx-binary-file-format-specification/
 *		https://wiki.rogiken.org/specifications/file-format/fbx/ (more detail but Japanese)
 */


export default function FBXLoader( manager ) {

  this.manager = ( manager !== undefined ) ? manager : DefaultLoadingManager;

}

Object.assign( FBXLoader.prototype, {

  load( url, onLoad, onProgress, onError ) {

    const self = this;

    const resourceDirectory = LoaderUtils.extractUrlBase( url );

    const loader = new FileLoader( this.manager );
    loader.setResponseType( 'arraybuffer' );
    loader.load( url, ( buffer ) => {

      try {

        const scene = self.parse( buffer, resourceDirectory );
        onLoad( scene );

      } catch ( error ) {

        window.setTimeout( () => {

          if ( onError ) onError( error );

          self.manager.itemError( url );

        }, 0 );

      }

    }, onProgress, onError );

  },

  parse( FBXBuffer, resourceDirectory ) {

    let FBXTree;

    if ( isFbxFormatBinary( FBXBuffer ) ) {

      FBXTree = new BinaryParser().parse( FBXBuffer );

    } else {

      const FBXText = convertArrayBufferToString( FBXBuffer );

      if ( !isFbxFormatASCII( FBXText ) ) {

        throw new Error( 'FBXLoader: Unknown format.' );

      }

      if ( getFbxVersion( FBXText ) < 7000 ) {

        throw new Error( 'FBXLoader: FBX version not supported, FileVersion: ' + getFbxVersion( FBXText ) );

      }

      FBXTree = new TextParser().parse( FBXText );

    }

    // console.log( FBXTree );

    const connections = parseConnections( FBXTree );
    const images = parseImages( FBXTree );
    const textures = parseTextures( FBXTree, new TextureLoader( this.manager ).setPath( resourceDirectory ), images, connections );
    const materials = parseMaterials( FBXTree, textures, connections );
    const skeletons = parseDeformers( FBXTree, connections );
    const geometryMap = parseGeometries( FBXTree, connections, skeletons );
    const sceneGraph = parseScene( FBXTree, connections, skeletons, geometryMap, materials );

    return sceneGraph;

  },

} );

// Parses FBXTree.Connections which holds parent-child connections between objects (e.g. material -> texture, model->geometry )
// and details the connection type
function parseConnections( FBXTree ) {

  const connectionMap = new Map();

  if ( 'Connections' in FBXTree ) {

    const rawConnections = FBXTree.Connections.connections;

    rawConnections.forEach( ( rawConnection ) => {

      const fromID = rawConnection[ 0 ];
      const toID = rawConnection[ 1 ];
      const relationship = rawConnection[ 2 ];

      if ( !connectionMap.has( fromID ) ) {

        connectionMap.set( fromID, {
          parents: [],
          children: [],
        } );

      }

      const parentRelationship = { ID: toID, relationship };
      connectionMap.get( fromID ).parents.push( parentRelationship );

      if ( !connectionMap.has( toID ) ) {

        connectionMap.set( toID, {
          parents: [],
          children: [],
        } );

      }

      const childRelationship = { ID: fromID, relationship };
      connectionMap.get( toID ).children.push( childRelationship );

    } );

  }

  return connectionMap;

}

// Parse FBXTree.Objects.Video for embedded image data
// These images are connected to textures in FBXTree.Objects.Textures
// via FBXTree.Connections.
function parseImages( FBXTree ) {

  const images = {};
  const blobs = {};

  if ( 'Video' in FBXTree.Objects ) {

    const videoNodes = FBXTree.Objects.Video;

    for ( const nodeID in videoNodes ) {

      const videoNode = videoNodes[ nodeID ];

      var id = parseInt( nodeID );

      images[ id ] = videoNode.Filename;

      // raw image data is in videoNode.Content
      if ( 'Content' in videoNode ) {

        const arrayBufferContent = ( videoNode.Content instanceof ArrayBuffer ) && ( videoNode.Content.byteLength > 0 );
        const base64Content = ( typeof videoNode.Content === 'string' ) && ( videoNode.Content !== '' );

        if ( arrayBufferContent || base64Content ) {

          const image = parseImage( videoNodes[ nodeID ] );

          blobs[ videoNode.Filename ] = image;

        }

      }

    }

  }

  for ( var id in images ) {

    const filename = images[ id ];

    if ( blobs[ filename ] !== undefined ) images[ id ] = blobs[ filename ];
    else images[ id ] = images[ id ].split( '\\' ).pop();

  }

  return images;

}

// Parse embedded image data in FBXTree.Video.Content
function parseImage( videoNode ) {

  const content = videoNode.Content;
  const fileName = videoNode.RelativeFilename || videoNode.Filename;
  const extension = fileName.slice( fileName.lastIndexOf( '.' ) + 1 ).toLowerCase();

  let type;

  switch ( extension ) {

    case 'bmp':

      type = 'image/bmp';
      break;

    case 'jpg':
    case 'jpeg':

      type = 'image/jpeg';
      break;

    case 'png':

      type = 'image/png';
      break;

    case 'tif':

      type = 'image/tiff';
      break;

    default:

      console.warn( 'FBXLoader: Image type "' + extension + '" is not supported.' );
      return;

  }

  if ( typeof content === 'string' ) { // ASCII format

    return 'data:' + type + ';base64,' + content;

  } // Binary Format

  const array = new Uint8Array( content );
  return window.URL.createObjectURL( new Blob( [ array ], { type } ) );


}

// Parse nodes in FBXTree.Objects.Texture
// These contain details such as UV scaling, cropping, rotation etc and are connected
// to images in FBXTree.Objects.Video
function parseTextures( FBXTree, loader, images, connections ) {

  const textureMap = new Map();

  if ( 'Texture' in FBXTree.Objects ) {

    const textureNodes = FBXTree.Objects.Texture;
    for ( const nodeID in textureNodes ) {

      const texture = parseTexture( textureNodes[ nodeID ], loader, images, connections );
      textureMap.set( parseInt( nodeID ), texture );

    }

  }

  return textureMap;

}

// Parse individual node in FBXTree.Objects.Texture
function parseTexture( textureNode, loader, images, connections ) {

  const texture = loadTexture( textureNode, loader, images, connections );

  texture.ID = textureNode.id;

  texture.name = textureNode.attrName;

  const wrapModeU = textureNode.WrapModeU;
  const wrapModeV = textureNode.WrapModeV;

  const valueU = wrapModeU !== undefined ? wrapModeU.value : 0;
  const valueV = wrapModeV !== undefined ? wrapModeV.value : 0;

  // http://download.autodesk.com/us/fbx/SDKdocs/FBX_SDK_Help/files/fbxsdkref/class_k_fbx_texture.html#889640e63e2e681259ea81061b85143a
  // 0: repeat(default), 1: clamp

  texture.wrapS = valueU === 0 ? RepeatWrapping : ClampToEdgeWrapping;
  texture.wrapT = valueV === 0 ? RepeatWrapping : ClampToEdgeWrapping;

  if ( 'Scaling' in textureNode ) {

    const values = textureNode.Scaling.value;

    texture.repeat.x = values[ 0 ];
    texture.repeat.y = values[ 1 ];

  }

  return texture;

}

// load a texture specified as a blob or data URI, or via an external URL using TextureLoader
function loadTexture( textureNode, loader, images, connections ) {

  let fileName;

  const children = connections.get( textureNode.id ).children;

  if ( children !== undefined && children.length > 0 && images[ children[ 0 ].ID ] !== undefined ) {

    fileName = images[ children[ 0 ].ID ];

  }

  const currentPath = loader.path;

  if ( fileName.indexOf( 'blob:' ) === 0 || fileName.indexOf( 'data:' ) === 0 ) {

    loader.setPath( undefined );

  }

  const texture = loader.load( fileName );

  loader.setPath( currentPath );

  return texture;

}

// Parse nodes in FBXTree.Objects.Material
function parseMaterials( FBXTree, textureMap, connections ) {

  const materialMap = new Map();

  if ( 'Material' in FBXTree.Objects ) {

    const materialNodes = FBXTree.Objects.Material;

    for ( const nodeID in materialNodes ) {

      const material = parseMaterial( FBXTree, materialNodes[ nodeID ], textureMap, connections );

      if ( material !== null ) materialMap.set( parseInt( nodeID ), material );

    }

  }

  return materialMap;

}

// Parse single node in FBXTree.Objects.Material
// Materials are connected to texture maps in FBXTree.Objects.Textures
// FBX format currently only supports Lambert and Phong shading models
function parseMaterial( FBXTree, materialNode, textureMap, connections ) {

  const ID = materialNode.id;
  const name = materialNode.attrName;
  let type = materialNode.ShadingModel;

  // Case where FBX wraps shading model in property object.
  if ( typeof type === 'object' ) {

    type = type.value;

  }

  // Ignore unused materials which don't have any connections.
  if ( !connections.has( ID ) ) return null;

  const parameters = parseParameters( FBXTree, materialNode, textureMap, ID, connections );

  let material;

  switch ( type.toLowerCase() ) {

    case 'phong':
      material = new MeshPhongMaterial();
      break;
    case 'lambert':
      material = new MeshLambertMaterial();
      break;
    default:
      console.warn( 'FBXLoader: unknown material type "%s". Defaulting to MeshPhongMaterial.', type );
      material = new MeshPhongMaterial( { color: 0x3300ff } );
      break;

  }

  material.setValues( parameters );
  material.name = name;

  return material;

}

// Parse FBX material and return parameters suitable for a three.js material
// Also parse the texture map and return any textures associated with the material
function parseParameters( FBXTree, properties, textureMap, ID, connections ) {

  const parameters = {};

  if ( properties.BumpFactor ) {

    parameters.bumpScale = properties.BumpFactor.value;

  }
  if ( properties.Diffuse ) {

    parameters.color = parseColor( properties.Diffuse );

  }
  if ( properties.DisplacementFactor ) {

    parameters.displacementScale = properties.DisplacementFactor.value;

  }
  if ( properties.ReflectionFactor ) {

    parameters.reflectivity = properties.ReflectionFactor.value;

  }
  if ( properties.Specular ) {

    parameters.specular = parseColor( properties.Specular );

  }
  if ( properties.Shininess ) {

    parameters.shininess = properties.Shininess.value;

  }
  if ( properties.Emissive ) {

    parameters.emissive = parseColor( properties.Emissive );

  }
  if ( properties.EmissiveFactor ) {

    parameters.emissiveIntensity = parseFloat( properties.EmissiveFactor.value );

  }
  if ( properties.Opacity ) {

    parameters.opacity = parseFloat( properties.Opacity.value );

  }
  if ( parameters.opacity < 1.0 ) {

    parameters.transparent = true;

  }

  connections.get( ID ).children.forEach( ( child ) => {

    const type = child.relationship;

    switch ( type ) {

      case 'Bump':
        parameters.bumpMap = textureMap.get( child.ID );
        break;

      case 'DiffuseColor':
        parameters.map = getTexture( FBXTree, textureMap, child.ID, connections );
        break;

      case 'DisplacementColor':
        parameters.displacementMap = getTexture( FBXTree, textureMap, child.ID, connections );
        break;


      case 'EmissiveColor':
        parameters.emissiveMap = getTexture( FBXTree, textureMap, child.ID, connections );
        break;

      case 'NormalMap':
        parameters.normalMap = getTexture( FBXTree, textureMap, child.ID, connections );
        break;

      case 'ReflectionColor':
        parameters.envMap = getTexture( FBXTree, textureMap, child.ID, connections );
        parameters.envMap.mapping = EquirectangularReflectionMapping;
        break;

      case 'SpecularColor':
        parameters.specularMap = getTexture( FBXTree, textureMap, child.ID, connections );
        break;

      case 'TransparentColor':
        parameters.alphaMap = getTexture( FBXTree, textureMap, child.ID, connections );
        parameters.transparent = true;
        break;

      case 'AmbientColor':
      case 'ShininessExponent': // AKA glossiness map
      case 'SpecularFactor': // AKA specularLevel
      case 'VectorDisplacementColor': // NOTE: Seems to be a copy of DisplacementColor
      default:
        console.warn( 'FBXLoader: %s map is not supported in three.js, skipping texture.', type );
        break;

    }

  } );

  return parameters;

}

// get a texture from the textureMap for use by a material.
function getTexture( FBXTree, textureMap, id, connections ) {

  // if the texture is a layered texture, just use the first layer and issue a warning
  if ( 'LayeredTexture' in FBXTree.Objects && id in FBXTree.Objects.LayeredTexture ) {

    console.warn( 'FBXLoader: layered textures are not supported in three.js. Discarding all but first layer.' );
    id = connections.get( id ).children[ 0 ].ID;

  }

  return textureMap.get( id );

}

// Parse nodes in FBXTree.Objects.Deformer
// Deformer node can contain skinning or Vertex Cache animation data, however only skinning is supported here
// Generates map of Skeleton-like objects for use later when generating and binding skeletons.
function parseDeformers( FBXTree, connections ) {

  const skeletons = {};

  if ( 'Deformer' in FBXTree.Objects ) {

    const DeformerNodes = FBXTree.Objects.Deformer;

    for ( const nodeID in DeformerNodes ) {

      const deformerNode = DeformerNodes[ nodeID ];

      if ( deformerNode.attrType === 'Skin' ) {

        const relationships = connections.get( parseInt( nodeID ) );

        const skeleton = parseSkeleton( relationships, DeformerNodes );
        skeleton.ID = nodeID;

        if ( relationships.parents.length > 1 ) console.warn( 'FBXLoader: skeleton attached to more than one geometry is not supported.' );
        skeleton.geometryID = relationships.parents[ 0 ].ID;

        skeletons[ nodeID ] = skeleton;

      }

    }

  }

  return skeletons;

}

// Parse single nodes in FBXTree.Objects.Deformer
// The top level deformer nodes have type 'Skin' and subDeformer nodes have type 'Cluster'
// Each skin node represents a skeleton and each cluster node represents a bone
function parseSkeleton( connections, deformerNodes ) {

  const rawBones = [];

  connections.children.forEach( ( child ) => {

    const subDeformerNode = deformerNodes[ child.ID ];

    if ( subDeformerNode.attrType !== 'Cluster' ) return;

    const rawBone = {

      ID: child.ID,
      indices: [],
      weights: [],
      transform: new Matrix4().fromArray( subDeformerNode.Transform.a ),
      transformLink: new Matrix4().fromArray( subDeformerNode.TransformLink.a ),
      linkMode: subDeformerNode.Mode,

    };

    if ( 'Indexes' in subDeformerNode ) {

      rawBone.indices = subDeformerNode.Indexes.a;
      rawBone.weights = subDeformerNode.Weights.a;

    }

    rawBones.push( rawBone );

  } );

  return {

    rawBones,
    bones: [],

  };

}

// Parse nodes in FBXTree.Objects.Geometry
function parseGeometries( FBXTree, connections, skeletons ) {

  const geometryMap = new Map();

  if ( 'Geometry' in FBXTree.Objects ) {

    const geometryNodes = FBXTree.Objects.Geometry;


    for ( const nodeID in geometryNodes ) {

      const relationships = connections.get( parseInt( nodeID ) );
      const geo = parseGeometry( FBXTree, relationships, geometryNodes[ nodeID ], skeletons );

      geometryMap.set( parseInt( nodeID ), geo );

    }

  }

  return geometryMap;

}

// Parse single node in FBXTree.Objects.Geometry
function parseGeometry( FBXTree, relationships, geometryNode, skeletons ) {

  switch ( geometryNode.attrType ) {

    case 'Mesh':
      return parseMeshGeometry( FBXTree, relationships, geometryNode, skeletons );
      break;

    case 'NurbsCurve':
      return parseNurbsGeometry( geometryNode );
      break;

  }

}


// Parse single node mesh geometry in FBXTree.Objects.Geometry
function parseMeshGeometry( FBXTree, relationships, geometryNode, skeletons ) {

  const modelNodes = relationships.parents.map( ( parent ) => {

    return FBXTree.Objects.Model[ parent.ID ];

  } );

  // don't create geometry if it is not associated with any models
  if ( modelNodes.length === 0 ) return;

  const skeleton = relationships.children.reduce( ( skeleton, child ) => {

    if ( skeletons[ child.ID ] !== undefined ) skeleton = skeletons[ child.ID ];

    return skeleton;

  }, null );

  const preTransform = new Matrix4();

  // TODO: if there is more than one model associated with the geometry, AND the models have
  // different geometric transforms, then this will cause problems
  // if ( modelNodes.length > 1 ) { }

  // For now just assume one model and get the preRotations from that
  const modelNode = modelNodes[ 0 ];

  if ( 'GeometricRotation' in modelNode ) {

    const array = modelNode.GeometricRotation.value.map( _Math.degToRad );
    array[ 3 ] = 'ZYX';

    preTransform.makeRotationFromEuler( new Euler().fromArray( array ) );

  }

  if ( 'GeometricTranslation' in modelNode ) {

    preTransform.setPosition( new Vector3().fromArray( modelNode.GeometricTranslation.value ) );

  }

  return genGeometry( FBXTree, relationships, geometryNode, skeleton, preTransform );

}

// Generate a BufferGeometry from a node in FBXTree.Objects.Geometry
function genGeometry( FBXTree, relationships, geometryNode, skeleton, preTransform ) {

  const vertexPositions = geometryNode.Vertices.a;
  const vertexIndices = geometryNode.PolygonVertexIndex.a;

  // create arrays to hold the final data used to build the buffergeometry
  const vertexBuffer = [];
  const normalBuffer = [];
  const colorsBuffer = [];
  const uvsBuffer = [];
  const materialIndexBuffer = [];
  const vertexWeightsBuffer = [];
  const weightsIndicesBuffer = [];

  if ( geometryNode.LayerElementColor ) {

    var colorInfo = getColors( geometryNode.LayerElementColor[ 0 ] );

  }

  if ( geometryNode.LayerElementMaterial ) {

    var materialInfo = getMaterials( geometryNode.LayerElementMaterial[ 0 ] );

  }

  if ( geometryNode.LayerElementNormal ) {

    var normalInfo = getNormals( geometryNode.LayerElementNormal[ 0 ] );

  }

  if ( geometryNode.LayerElementUV ) {

    var uvInfo = [];
    let i = 0;
    while ( geometryNode.LayerElementUV[ i ] ) {

      uvInfo.push( getUVs( geometryNode.LayerElementUV[ i ] ) );
      i++;

    }

  }

  const weightTable = {};

  if ( skeleton !== null ) {

    skeleton.rawBones.forEach( ( rawBone, i ) => {

      // loop over the bone's vertex indices and weights
      rawBone.indices.forEach( ( index, j ) => {

        if ( weightTable[ index ] === undefined ) weightTable[ index ] = [];

        weightTable[ index ].push( {

          id: i,
          weight: rawBone.weights[ j ],

        } );

      } );

    } );

  }

  let polygonIndex = 0;
  let faceLength = 0;
  let displayedWeightsWarning = false;

  // these will hold data for a single face
  let vertexPositionIndexes = [];
  let faceNormals = [];
  let faceColors = [];
  let faceUVs = [];
  let faceWeights = [];
  let faceWeightIndices = [];

  vertexIndices.forEach( ( vertexIndex, polygonVertexIndex ) => {

    let endOfFace = false;

    // Face index and vertex index arrays are combined in a single array
    // A cube with quad faces looks like this:
    // PolygonVertexIndex: *24 {
    //  a: 0, 1, 3, -3, 2, 3, 5, -5, 4, 5, 7, -7, 6, 7, 1, -1, 1, 7, 5, -4, 6, 0, 2, -5
    //  }
    // Negative numbers mark the end of a face - first face here is 0, 1, 3, -3
    // to find index of last vertex multiply by -1 and subtract 1: -3 * - 1 - 1 = 2
    if ( vertexIndex < 0 ) {

      vertexIndex ^= -1; // equivalent to ( x * -1 ) - 1
      vertexIndices[ polygonVertexIndex ] = vertexIndex;
      endOfFace = true;

    }

    let weightIndices = [];
    let weights = [];

    vertexPositionIndexes.push( vertexIndex * 3, vertexIndex * 3 + 1, vertexIndex * 3 + 2 );

    if ( colorInfo ) {

      var data = getData( polygonVertexIndex, polygonIndex, vertexIndex, colorInfo );

      faceColors.push( data[ 0 ], data[ 1 ], data[ 2 ] );

    }

    if ( skeleton ) {

      if ( weightTable[ vertexIndex ] !== undefined ) {

        weightTable[ vertexIndex ].forEach( ( wt ) => {

          weights.push( wt.weight );
          weightIndices.push( wt.id );

        } );


      }

      if ( weights.length > 4 ) {

        if ( !displayedWeightsWarning ) {

          console.warn( 'FBXLoader: Vertex has more than 4 skinning weights assigned to vertex. Deleting additional weights.' );
          displayedWeightsWarning = true;

        }

        const wIndex = [ 0, 0, 0, 0 ];
        const Weight = [ 0, 0, 0, 0 ];

        weights.forEach( ( weight, weightIndex ) => {

          let currentWeight = weight;
          let currentIndex = weightIndices[ weightIndex ];

          Weight.forEach( ( comparedWeight, comparedWeightIndex, comparedWeightArray ) => {

            if ( currentWeight > comparedWeight ) {

              comparedWeightArray[ comparedWeightIndex ] = currentWeight;
              currentWeight = comparedWeight;

              const tmp = wIndex[ comparedWeightIndex ];
              wIndex[ comparedWeightIndex ] = currentIndex;
              currentIndex = tmp;

            }

          } );

        } );

        weightIndices = wIndex;
        weights = Weight;

      }

      // if the weight array is shorter than 4 pad with 0s
      while ( weights.length < 4 ) {

        weights.push( 0 );
        weightIndices.push( 0 );

      }

      for ( var i = 0; i < 4; ++i ) {

        faceWeights.push( weights[ i ] );
        faceWeightIndices.push( weightIndices[ i ] );

      }

    }

    if ( normalInfo ) {

      var data = getData( polygonVertexIndex, polygonIndex, vertexIndex, normalInfo );

      faceNormals.push( data[ 0 ], data[ 1 ], data[ 2 ] );

    }

    if ( materialInfo && materialInfo.mappingType !== 'AllSame' ) {

      var materialIndex = getData( polygonVertexIndex, polygonIndex, vertexIndex, materialInfo )[ 0 ];

    }

    if ( uvInfo ) {

      uvInfo.forEach( ( uv, i ) => {

        const data = getData( polygonVertexIndex, polygonIndex, vertexIndex, uv );

        if ( faceUVs[ i ] === undefined ) {

          faceUVs[ i ] = [];

        }

        faceUVs[ i ].push( data[ 0 ] );
        faceUVs[ i ].push( data[ 1 ] );

      } );

    }

    faceLength++;

    // we have reached the end of a face - it may have 4 sides though
    // in which case the data is split to represent two 3 sided faces
    if ( endOfFace ) {

      for ( var i = 2; i < faceLength; i++ ) {

        vertexBuffer.push( vertexPositions[ vertexPositionIndexes[ 0 ] ] );
        vertexBuffer.push( vertexPositions[ vertexPositionIndexes[ 1 ] ] );
        vertexBuffer.push( vertexPositions[ vertexPositionIndexes[ 2 ] ] );

        vertexBuffer.push( vertexPositions[ vertexPositionIndexes[ ( i - 1 ) * 3 ] ] );
        vertexBuffer.push( vertexPositions[ vertexPositionIndexes[ ( i - 1 ) * 3 + 1 ] ] );
        vertexBuffer.push( vertexPositions[ vertexPositionIndexes[ ( i - 1 ) * 3 + 2 ] ] );

        vertexBuffer.push( vertexPositions[ vertexPositionIndexes[ i * 3 ] ] );
        vertexBuffer.push( vertexPositions[ vertexPositionIndexes[ i * 3 + 1 ] ] );
        vertexBuffer.push( vertexPositions[ vertexPositionIndexes[ i * 3 + 2 ] ] );

        if ( skeleton ) {

          vertexWeightsBuffer.push( faceWeights[ 0 ] );
          vertexWeightsBuffer.push( faceWeights[ 1 ] );
          vertexWeightsBuffer.push( faceWeights[ 2 ] );
          vertexWeightsBuffer.push( faceWeights[ 3 ] );

          vertexWeightsBuffer.push( faceWeights[ ( i - 1 ) * 4 ] );
          vertexWeightsBuffer.push( faceWeights[ ( i - 1 ) * 4 + 1 ] );
          vertexWeightsBuffer.push( faceWeights[ ( i - 1 ) * 4 + 2 ] );
          vertexWeightsBuffer.push( faceWeights[ ( i - 1 ) * 4 + 3 ] );

          vertexWeightsBuffer.push( faceWeights[ i * 4 ] );
          vertexWeightsBuffer.push( faceWeights[ i * 4 + 1 ] );
          vertexWeightsBuffer.push( faceWeights[ i * 4 + 2 ] );
          vertexWeightsBuffer.push( faceWeights[ i * 4 + 3 ] );

          weightsIndicesBuffer.push( faceWeightIndices[ 0 ] );
          weightsIndicesBuffer.push( faceWeightIndices[ 1 ] );
          weightsIndicesBuffer.push( faceWeightIndices[ 2 ] );
          weightsIndicesBuffer.push( faceWeightIndices[ 3 ] );

          weightsIndicesBuffer.push( faceWeightIndices[ ( i - 1 ) * 4 ] );
          weightsIndicesBuffer.push( faceWeightIndices[ ( i - 1 ) * 4 + 1 ] );
          weightsIndicesBuffer.push( faceWeightIndices[ ( i - 1 ) * 4 + 2 ] );
          weightsIndicesBuffer.push( faceWeightIndices[ ( i - 1 ) * 4 + 3 ] );

          weightsIndicesBuffer.push( faceWeightIndices[ i * 4 ] );
          weightsIndicesBuffer.push( faceWeightIndices[ i * 4 + 1 ] );
          weightsIndicesBuffer.push( faceWeightIndices[ i * 4 + 2 ] );
          weightsIndicesBuffer.push( faceWeightIndices[ i * 4 + 3 ] );

        }

        if ( colorInfo ) {

          colorsBuffer.push( faceColors[ 0 ] );
          colorsBuffer.push( faceColors[ 1 ] );
          colorsBuffer.push( faceColors[ 2 ] );

          colorsBuffer.push( faceColors[ ( i - 1 ) * 3 ] );
          colorsBuffer.push( faceColors[ ( i - 1 ) * 3 + 1 ] );
          colorsBuffer.push( faceColors[ ( i - 1 ) * 3 + 2 ] );

          colorsBuffer.push( faceColors[ i * 3 ] );
          colorsBuffer.push( faceColors[ i * 3 + 1 ] );
          colorsBuffer.push( faceColors[ i * 3 + 2 ] );

        }

        if ( materialInfo && materialInfo.mappingType !== 'AllSame' ) {

          materialIndexBuffer.push( materialIndex );
          materialIndexBuffer.push( materialIndex );
          materialIndexBuffer.push( materialIndex );

        }

        if ( normalInfo ) {

          normalBuffer.push( faceNormals[ 0 ] );
          normalBuffer.push( faceNormals[ 1 ] );
          normalBuffer.push( faceNormals[ 2 ] );

          normalBuffer.push( faceNormals[ ( i - 1 ) * 3 ] );
          normalBuffer.push( faceNormals[ ( i - 1 ) * 3 + 1 ] );
          normalBuffer.push( faceNormals[ ( i - 1 ) * 3 + 2 ] );

          normalBuffer.push( faceNormals[ i * 3 ] );
          normalBuffer.push( faceNormals[ i * 3 + 1 ] );
          normalBuffer.push( faceNormals[ i * 3 + 2 ] );

        }

        if ( uvInfo ) {

          uvInfo.forEach( ( uv, j ) => {

            if ( uvsBuffer[ j ] === undefined ) uvsBuffer[ j ] = [];

            uvsBuffer[ j ].push( faceUVs[ j ][ 0 ] );
            uvsBuffer[ j ].push( faceUVs[ j ][ 1 ] );

            uvsBuffer[ j ].push( faceUVs[ j ][ ( i - 1 ) * 2 ] );
            uvsBuffer[ j ].push( faceUVs[ j ][ ( i - 1 ) * 2 + 1 ] );

            uvsBuffer[ j ].push( faceUVs[ j ][ i * 2 ] );
            uvsBuffer[ j ].push( faceUVs[ j ][ i * 2 + 1 ] );

          } );

        }

      }

      polygonIndex++;
      faceLength = 0;

      // reset arrays for the next face
      vertexPositionIndexes = [];
      faceNormals = [];
      faceColors = [];
      faceUVs = [];
      faceWeights = [];
      faceWeightIndices = [];

    }

  } );

  const geo = new BufferGeometry();
  geo.name = geometryNode.name;

  const positionAttribute = new Float32BufferAttribute( vertexBuffer, 3 );

  preTransform.applyToBufferAttribute( positionAttribute );

  geo.addAttribute( 'position', positionAttribute );

  if ( colorsBuffer.length > 0 ) {

    geo.addAttribute( 'color', new Float32BufferAttribute( colorsBuffer, 3 ) );

  }

  if ( skeleton ) {

    geo.addAttribute( 'skinIndex', new Float32BufferAttribute( weightsIndicesBuffer, 4 ) );

    geo.addAttribute( 'skinWeight', new Float32BufferAttribute( vertexWeightsBuffer, 4 ) );

    // used later to bind the skeleton to the model
    geo.FBX_Deformer = skeleton;

  }

  if ( normalBuffer.length > 0 ) {

    geo.addAttribute( 'normal', new Float32BufferAttribute( normalBuffer, 3 ) );

  }

  uvsBuffer.forEach( ( uvBuffer, i ) => {

    // subsequent uv buffers are called 'uv1', 'uv2', ...
    let name = 'uv' + ( i + 1 ).toString();

    // the first uv buffer is just called 'uv'
    if ( i === 0 ) {

      name = 'uv';

    }

    geo.addAttribute( name, new Float32BufferAttribute( uvsBuffer[ i ], 2 ) );

  } );

  if ( materialInfo && materialInfo.mappingType !== 'AllSame' ) {

    // Convert the material indices of each vertex into rendering groups on the geometry.
    let prevMaterialIndex = materialIndexBuffer[ 0 ];
    let startIndex = 0;

    materialIndexBuffer.forEach( ( currentIndex, i ) => {

      if ( currentIndex !== prevMaterialIndex ) {

        geo.addGroup( startIndex, i - startIndex, prevMaterialIndex );

        prevMaterialIndex = currentIndex;
        startIndex = i;

      }

    } );

    // the loop above doesn't add the last group, do that here.
    if ( geo.groups.length > 0 ) {

      const lastGroup = geo.groups[ geo.groups.length - 1 ];
      const lastIndex = lastGroup.start + lastGroup.count;

      if ( lastIndex !== materialIndexBuffer.length ) {

        geo.addGroup( lastIndex, materialIndexBuffer.length - lastIndex, prevMaterialIndex );

      }

    }

    // case where there are multiple materials but the whole geometry is only
    // using one of them
    if ( geo.groups.length === 0 ) {

      geo.addGroup( 0, materialIndexBuffer.length, materialIndexBuffer[ 0 ] );

    }

  }

  return geo;

}


// Parse normal from FBXTree.Objects.Geometry.LayerElementNormal if it exists
function getNormals( NormalNode ) {

  const mappingType = NormalNode.MappingInformationType;
  const referenceType = NormalNode.ReferenceInformationType;
  const buffer = NormalNode.Normals.a;
  let indexBuffer = [];
  if ( referenceType === 'IndexToDirect' ) {

    if ( 'NormalIndex' in NormalNode ) {

      indexBuffer = NormalNode.NormalIndex.a;

    } else if ( 'NormalsIndex' in NormalNode ) {

      indexBuffer = NormalNode.NormalsIndex.a;

    }

  }

  return {
    dataSize: 3,
    buffer,
    indices: indexBuffer,
    mappingType,
    referenceType,
  };

}

// Parse UVs from FBXTree.Objects.Geometry.LayerElementUV if it exists
function getUVs( UVNode ) {

  const mappingType = UVNode.MappingInformationType;
  const referenceType = UVNode.ReferenceInformationType;
  const buffer = UVNode.UV.a;
  let indexBuffer = [];
  if ( referenceType === 'IndexToDirect' ) {

    indexBuffer = UVNode.UVIndex.a;

  }

  return {
    dataSize: 2,
    buffer,
    indices: indexBuffer,
    mappingType,
    referenceType,
  };

}

// Parse Vertex Colors from FBXTree.Objects.Geometry.LayerElementColor if it exists
function getColors( ColorNode ) {

  const mappingType = ColorNode.MappingInformationType;
  const referenceType = ColorNode.ReferenceInformationType;
  const buffer = ColorNode.Colors.a;
  let indexBuffer = [];
  if ( referenceType === 'IndexToDirect' ) {

    indexBuffer = ColorNode.ColorIndex.a;

  }

  return {
    dataSize: 4,
    buffer,
    indices: indexBuffer,
    mappingType,
    referenceType,
  };

}

// Parse mapping and material data in FBXTree.Objects.Geometry.LayerElementMaterial if it exists
function getMaterials( MaterialNode ) {

  const mappingType = MaterialNode.MappingInformationType;
  const referenceType = MaterialNode.ReferenceInformationType;

  if ( mappingType === 'NoMappingInformation' ) {

    return {
      dataSize: 1,
      buffer: [ 0 ],
      indices: [ 0 ],
      mappingType: 'AllSame',
      referenceType,
    };

  }

  const materialIndexBuffer = MaterialNode.Materials.a;

  // Since materials are stored as indices, there's a bit of a mismatch between FBX and what
  // we expect.So we create an intermediate buffer that points to the index in the buffer,
  // for conforming with the other functions we've written for other data.
  const materialIndices = [];

  for ( let i = 0; i < materialIndexBuffer.length; ++i ) {

    materialIndices.push( i );

  }

  return {
    dataSize: 1,
    buffer: materialIndexBuffer,
    indices: materialIndices,
    mappingType,
    referenceType,
  };

}

// Functions use the infoObject and given indices to return value array of geometry.
// Parameters:
// 	- polygonVertexIndex - Index of vertex in draw order (which index of the index buffer refers to this vertex).
// 	- polygonIndex - Index of polygon in geometry.
// 	- vertexIndex - Index of vertex inside vertex buffer (used because some data refers to old index buffer that we don't use anymore).
// 	- infoObject: can be materialInfo, normalInfo, UVInfo or colorInfo
// Index type:
//	- Direct: index is same as polygonVertexIndex
//	- IndexToDirect: infoObject has it's own set of indices
const dataArray = [];

const GetData = {

  ByPolygonVertex: {

    Direct( polygonVertexIndex, polygonIndex, vertexIndex, infoObject ) {

      const from = ( polygonVertexIndex * infoObject.dataSize );
      const to = ( polygonVertexIndex * infoObject.dataSize ) + infoObject.dataSize;

      return slice( dataArray, infoObject.buffer, from, to );

    },

    IndexToDirect( polygonVertexIndex, polygonIndex, vertexIndex, infoObject ) {

      const index = infoObject.indices[ polygonVertexIndex ];
      const from = ( index * infoObject.dataSize );
      const to = ( index * infoObject.dataSize ) + infoObject.dataSize;

      return slice( dataArray, infoObject.buffer, from, to );

    },

  },

  ByPolygon: {

    Direct( polygonVertexIndex, polygonIndex, vertexIndex, infoObject ) {

      const from = polygonIndex * infoObject.dataSize;
      const to = polygonIndex * infoObject.dataSize + infoObject.dataSize;

      return slice( dataArray, infoObject.buffer, from, to );

    },

    IndexToDirect( polygonVertexIndex, polygonIndex, vertexIndex, infoObject ) {

      const index = infoObject.indices[ polygonIndex ];
      const from = index * infoObject.dataSize;
      const to = index * infoObject.dataSize + infoObject.dataSize;

      return slice( dataArray, infoObject.buffer, from, to );

    },

  },

  ByVertice: {

    Direct( polygonVertexIndex, polygonIndex, vertexIndex, infoObject ) {

      const from = ( vertexIndex * infoObject.dataSize );
      const to = ( vertexIndex * infoObject.dataSize ) + infoObject.dataSize;

      return slice( dataArray, infoObject.buffer, from, to );

    },

  },

  AllSame: {

    IndexToDirect( polygonVertexIndex, polygonIndex, vertexIndex, infoObject ) {

      const from = infoObject.indices[ 0 ] * infoObject.dataSize;
      const to = infoObject.indices[ 0 ] * infoObject.dataSize + infoObject.dataSize;

      return slice( dataArray, infoObject.buffer, from, to );

    },

  },

};

function getData( polygonVertexIndex, polygonIndex, vertexIndex, infoObject ) {

  return GetData[ infoObject.mappingType ][ infoObject.referenceType ]( polygonVertexIndex, polygonIndex, vertexIndex, infoObject );

}

// Generate a NurbGeometry from a node in FBXTree.Objects.Geometry
function parseNurbsGeometry( geometryNode ) {

  if ( NURBSCurve === undefined ) {

    console.error( 'FBXLoader: The loader relies on NURBSCurve for any nurbs present in the model. Nurbs will show up as empty geometry.' );
    return new BufferGeometry();

  }

  const order = parseInt( geometryNode.Order );

  if ( isNaN( order ) ) {

    console.error( 'FBXLoader: Invalid Order %s given for geometry ID: %s', geometryNode.Order, geometryNode.id );
    return new BufferGeometry();

  }

  const degree = order - 1;

  const knots = geometryNode.KnotVector.a;
  const controlPoints = [];
  const pointsValues = geometryNode.Points.a;

  for ( var i = 0, l = pointsValues.length; i < l; i += 4 ) {

    controlPoints.push( new Vector4().fromArray( pointsValues, i ) );

  }

  let startKnot, endKnot;

  if ( geometryNode.Form === 'Closed' ) {

    controlPoints.push( controlPoints[ 0 ] );

  } else if ( geometryNode.Form === 'Periodic' ) {

    startKnot = degree;
    endKnot = knots.length - 1 - startKnot;

    for ( var i = 0; i < degree; ++i ) {

      controlPoints.push( controlPoints[ i ] );

    }

  }

  const curve = new NURBSCurve( degree, knots, controlPoints, startKnot, endKnot );
  const vertices = curve.getPoints( controlPoints.length * 7 );

  const positions = new Float32Array( vertices.length * 3 );

  vertices.forEach( ( vertex, i ) => {

    vertex.toArray( positions, i * 3 );

  } );

  const geometry = new BufferGeometry();
  geometry.addAttribute( 'position', new BufferAttribute( positions, 3 ) );

  return geometry;

}

// create the main Group() to be returned by the loader
function parseScene( FBXTree, connections, skeletons, geometryMap, materialMap ) {

  const sceneGraph = new Group();

  const modelMap = parseModels( FBXTree, skeletons, geometryMap, materialMap, connections );

  const modelNodes = FBXTree.Objects.Model;

  modelMap.forEach( ( model ) => {

    const modelNode = modelNodes[ model.ID ];
    setLookAtProperties( FBXTree, model, modelNode, connections, sceneGraph );

    const parentConnections = connections.get( model.ID ).parents;

    parentConnections.forEach( ( connection ) => {

      const parent = modelMap.get( connection.ID );
      if ( parent !== undefined ) parent.add( model );

    } );

    if ( model.parent === null ) {

      sceneGraph.add( model );

    }


  } );

  bindSkeleton( FBXTree, skeletons, geometryMap, modelMap, connections, sceneGraph );

  addAnimations( FBXTree, connections, sceneGraph );

  createAmbientLight( FBXTree, sceneGraph );

  return sceneGraph;

}

// parse nodes in FBXTree.Objects.Model
function parseModels( FBXTree, skeletons, geometryMap, materialMap, connections ) {

  const modelMap = new Map();
  const modelNodes = FBXTree.Objects.Model;

  for ( const nodeID in modelNodes ) {

    const id = parseInt( nodeID );
    const node = modelNodes[ nodeID ];
    const relationships = connections.get( id );

    let model = buildSkeleton( relationships, skeletons, id, node.attrName );

    if ( !model ) {

      switch ( node.attrType ) {

        case 'Camera':
          model = createCamera( FBXTree, relationships );
          break;
        case 'Light':
          model = createLight( FBXTree, relationships );
          break;
        case 'Mesh':
          model = createMesh( FBXTree, relationships, geometryMap, materialMap );
          break;
        case 'NurbsCurve':
          model = createCurve( relationships, geometryMap );
          break;
        case 'LimbNode': // usually associated with a Bone, however if a Bone was not created we'll make a Group instead
        case 'Null':
        default:
          model = new Group();
          break;

      }

      model.name = PropertyBinding.sanitizeNodeName( node.attrName );
      model.ID = id;

    }

    setModelTransforms( FBXTree, model, node );
    modelMap.set( id, model );

  }

  return modelMap;

}

function buildSkeleton( relationships, skeletons, id, name ) {

  let bone = null;

  relationships.parents.forEach( ( parent ) => {

    for ( const ID in skeletons ) {

      const skeleton = skeletons[ ID ];

      skeleton.rawBones.forEach( ( rawBone, i ) => {

        if ( rawBone.ID === parent.ID ) {

          const subBone = bone;
          bone = new Bone();
          bone.matrixWorld.copy( rawBone.transformLink );

          // set name and id here - otherwise in cases where "subBone" is created it will not have a name / id
          bone.name = PropertyBinding.sanitizeNodeName( name );
          bone.ID = id;

          skeleton.bones[ i ] = bone;

          // In cases where a bone is shared between multiple meshes
          // duplicate the bone here and and it as a child of the first bone
          if ( subBone !== null ) {

            bone.add( subBone );

          }

        }

      } );

    }

  } );

  return bone;

}

// create a PerspectiveCamera or OrthographicCamera
function createCamera( FBXTree, relationships ) {

  let model;
  let cameraAttribute;

  relationships.children.forEach( ( child ) => {

    const attr = FBXTree.Objects.NodeAttribute[ child.ID ];

    if ( attr !== undefined ) {

      cameraAttribute = attr;

    }

  } );

  if ( cameraAttribute === undefined ) {

    model = new Object3D();

  } else {

    let type = 0;
    if ( cameraAttribute.CameraProjectionType !== undefined && cameraAttribute.CameraProjectionType.value === 1 ) {

      type = 1;

    }

    let nearClippingPlane = 1;
    if ( cameraAttribute.NearPlane !== undefined ) {

      nearClippingPlane = cameraAttribute.NearPlane.value / 1000;

    }

    let farClippingPlane = 1000;
    if ( cameraAttribute.FarPlane !== undefined ) {

      farClippingPlane = cameraAttribute.FarPlane.value / 1000;

    }


    let width = window.innerWidth;
    let height = window.innerHeight;

    if ( cameraAttribute.AspectWidth !== undefined && cameraAttribute.AspectHeight !== undefined ) {

      width = cameraAttribute.AspectWidth.value;
      height = cameraAttribute.AspectHeight.value;

    }

    const aspect = width / height;

    let fov = 45;
    if ( cameraAttribute.FieldOfView !== undefined ) {

      fov = cameraAttribute.FieldOfView.value;

    }

    switch ( type ) {

      case 0: // Perspective
        model = new PerspectiveCamera( fov, aspect, nearClippingPlane, farClippingPlane );
        break;

      case 1: // Orthographic
        model = new OrthographicCamera( -width / 2, width / 2, height / 2, -height / 2, nearClippingPlane, farClippingPlane );
        break;

      default:
        console.warn( 'FBXLoader: Unknown camera type ' + type + '.' );
        model = new Object3D();
        break;

    }

  }

  return model;

}

// Create a DirectionalLight, PointLight or SpotLight
function createLight( FBXTree, relationships ) {

  let model;
  let lightAttribute;

  relationships.children.forEach( ( child ) => {

    const attr = FBXTree.Objects.NodeAttribute[ child.ID ];

    if ( attr !== undefined ) {

      lightAttribute = attr;

    }

  } );

  if ( lightAttribute === undefined ) {

    model = new Object3D();

  } else {

    let type;

    // LightType can be undefined for Point lights
    if ( lightAttribute.LightType === undefined ) {

      type = 0;

    } else {

      type = lightAttribute.LightType.value;

    }

    let color = 0xffffff;

    if ( lightAttribute.Color !== undefined ) {

      color = parseColor( lightAttribute.Color );

    }

    let intensity = ( lightAttribute.Intensity === undefined ) ? 1 : lightAttribute.Intensity.value / 100;

    // light disabled
    if ( lightAttribute.CastLightOnObject !== undefined && lightAttribute.CastLightOnObject.value === 0 ) {

      intensity = 0;

    }

    let distance = 0;
    if ( lightAttribute.FarAttenuationEnd !== undefined ) {

      if ( lightAttribute.EnableFarAttenuation !== undefined && lightAttribute.EnableFarAttenuation.value === 0 ) {

        distance = 0;

      } else {

        distance = lightAttribute.FarAttenuationEnd.value / 1000;

      }

    }

    // TODO: could this be calculated linearly from FarAttenuationStart to FarAttenuationEnd?
    const decay = 1;

    switch ( type ) {

      case 0: // Point
        model = new PointLight( color, intensity, distance, decay );
        break;

      case 1: // Directional
        model = new DirectionalLight( color, intensity );
        break;

      case 2: // Spot
        var angle = Math.PI / 3;

        if ( lightAttribute.InnerAngle !== undefined ) {

          angle = _Math.degToRad( lightAttribute.InnerAngle.value );

        }

        var penumbra = 0;
        if ( lightAttribute.OuterAngle !== undefined ) {

          // TODO: this is not correct - FBX calculates outer and inner angle in degrees
          // with OuterAngle > InnerAngle && OuterAngle <= Math.PI
          // while three.js uses a penumbra between (0, 1) to attenuate the inner angle
          penumbra = _Math.degToRad( lightAttribute.OuterAngle.value );
          penumbra = Math.max( penumbra, 1 );

        }

        model = new SpotLight( color, intensity, distance, angle, penumbra, decay );
        break;

      default:
        console.warn( 'FBXLoader: Unknown light type ' + lightAttribute.LightType.value + ', defaulting to a PointLight.' );
        model = new PointLight( color, intensity );
        break;

    }

    if ( lightAttribute.CastShadows !== undefined && lightAttribute.CastShadows.value === 1 ) {

      model.castShadow = true;

    }

  }

  return model;

}

function createMesh( FBXTree, relationships, geometryMap, materialMap ) {

  let model;
  let geometry = null;
  let material = null;
  const materials = [];

  // get geometry and materials(s) from connections
  relationships.children.forEach( ( child ) => {

    if ( geometryMap.has( child.ID ) ) {

      geometry = geometryMap.get( child.ID );

    }

    if ( materialMap.has( child.ID ) ) {

      materials.push( materialMap.get( child.ID ) );

    }

  } );

  if ( materials.length > 1 ) {

    material = materials;

  } else if ( materials.length > 0 ) {

    material = materials[ 0 ];

  } else {

    material = new MeshPhongMaterial( { color: 0xcccccc } );
    materials.push( material );

  }

  if ( 'color' in geometry.attributes ) {

    materials.forEach( ( material ) => {

      material.vertexColors = VertexColors;

    } );

  }

  if ( geometry.FBX_Deformer ) {

    materials.forEach( ( material ) => {

      material.skinning = true;

    } );

    model = new SkinnedMesh( geometry, material );

  } else {

    model = new Mesh( geometry, material );

  }

  return model;

}

function createCurve( relationships, geometryMap ) {

  const geometry = relationships.children.reduce( ( geo, child ) => {

    if ( geometryMap.has( child.ID ) ) geo = geometryMap.get( child.ID );

    return geo;

  }, null );

  // FBX does not list materials for Nurbs lines, so we'll just put our own in here.
  const material = new LineBasicMaterial( { color: 0x3300ff, linewidth: 1 } );
  return new Line( geometry, material );

}

// Parse ambient color in FBXTree.GlobalSettings - if it's not set to black (default), create an ambient light
function createAmbientLight( FBXTree, sceneGraph ) {

  if ( 'GlobalSettings' in FBXTree && 'AmbientColor' in FBXTree.GlobalSettings ) {

    const ambientColor = FBXTree.GlobalSettings.AmbientColor.value;
    const r = ambientColor[ 0 ];
    const g = ambientColor[ 1 ];
    const b = ambientColor[ 2 ];

    if ( r !== 0 || g !== 0 || b !== 0 ) {

      const color = new Color( r, g, b );
      sceneGraph.add( new AmbientLight( color, 1 ) );

    }

  }

}

function setLookAtProperties( FBXTree, model, modelNode, connections, sceneGraph ) {

  if ( 'LookAtProperty' in modelNode ) {

    const children = connections.get( model.ID ).children;

    children.forEach( ( child ) => {

      if ( child.relationship === 'LookAtProperty' ) {

        const lookAtTarget = FBXTree.Objects.Model[ child.ID ];

        if ( 'Lcl_Translation' in lookAtTarget ) {

          const pos = lookAtTarget.Lcl_Translation.value;

          // DirectionalLight, SpotLight
          if ( model.target !== undefined ) {

            model.target.position.fromArray( pos );
            sceneGraph.add( model.target );

          } else { // Cameras and other Object3Ds

            model.lookAt( new Vector3().fromArray( pos ) );

          }

        }

      }

    } );

  }

}

// parse the model node for transform details and apply them to the model
function setModelTransforms( FBXTree, model, modelNode ) {

  // http://help.autodesk.com/view/FBX/2017/ENU/?guid=__cpp_ref_class_fbx_euler_html
  if ( 'RotationOrder' in modelNode ) {

    const enums = [
      'XYZ', // default
      'XZY',
      'YZX',
      'ZXY',
      'YXZ',
      'ZYX',
      'SphericXYZ',
    ];

    const value = parseInt( modelNode.RotationOrder.value, 10 );

    if ( value > 0 && value < 6 ) {

      // model.rotation.order = enums[ value ];

      // Note: Euler order other than XYZ is currently not supported, so just display a warning for now
      console.warn( 'FBXLoader: unsupported Euler Order: %s. Currently only XYZ order is supported. Animations and rotations may be incorrect.', enums[ value ] );

    } else if ( value === 6 ) {

      console.warn( 'FBXLoader: unsupported Euler Order: Spherical XYZ. Animations and rotations may be incorrect.' );

    }

  }

  if ( 'Lcl_Translation' in modelNode ) {

    model.position.fromArray( modelNode.Lcl_Translation.value );

  }

  if ( 'Lcl_Rotation' in modelNode ) {

    const rotation = modelNode.Lcl_Rotation.value.map( _Math.degToRad );
    rotation.push( 'ZYX' );
    model.rotation.fromArray( rotation );

  }

  if ( 'Lcl_Scaling' in modelNode ) {

    model.scale.fromArray( modelNode.Lcl_Scaling.value );

  }

  if ( 'PreRotation' in modelNode ) {

    const array = modelNode.PreRotation.value.map( _Math.degToRad );
    array[ 3 ] = 'ZYX';

    let preRotations = new Euler().fromArray( array );

    preRotations = new Quaternion().setFromEuler( preRotations );
    const currentRotation = new Quaternion().setFromEuler( model.rotation );
    preRotations.multiply( currentRotation );
    model.rotation.setFromQuaternion( preRotations, 'ZYX' );

  }

}

function bindSkeleton( FBXTree, skeletons, geometryMap, modelMap, connections ) {

  const bindMatrices = parsePoseNodes( FBXTree );

  for ( const ID in skeletons ) {

    var skeleton = skeletons[ ID ];

    const parents = connections.get( parseInt( skeleton.ID ) ).parents;

    parents.forEach( ( parent ) => {

      if ( geometryMap.has( parent.ID ) ) {

        const geoID = parent.ID;
        const geoRelationships = connections.get( geoID );

        geoRelationships.parents.forEach( ( geoConnParent ) => {

          if ( modelMap.has( geoConnParent.ID ) ) {

            const model = modelMap.get( geoConnParent.ID );

            model.bind( new Skeleton( skeleton.bones ), bindMatrices[ geoConnParent.ID ] );

          }

        } );

      }

    } );

  }

}

function parsePoseNodes( FBXTree ) {

  const bindMatrices = {};

  if ( 'Pose' in FBXTree.Objects ) {

    const BindPoseNode = FBXTree.Objects.Pose;

    for ( const nodeID in BindPoseNode ) {

      if ( BindPoseNode[ nodeID ].attrType === 'BindPose' ) {

        const poseNodes = BindPoseNode[ nodeID ].PoseNode;

        if ( Array.isArray( poseNodes ) ) {

          poseNodes.forEach( ( poseNode ) => {

            bindMatrices[ poseNode.Node ] = new Matrix4().fromArray( poseNode.Matrix.a );

          } );

        } else {

          bindMatrices[ poseNodes.Node ] = new Matrix4().fromArray( poseNodes.Matrix.a );

        }

      }

    }

  }

  return bindMatrices;

}

function parseAnimations( FBXTree, connections ) {

  // since the actual transformation data is stored in FBXTree.Objects.AnimationCurve,
  // if this is undefined we can safely assume there are no animations
  if ( FBXTree.Objects.AnimationCurve === undefined ) return undefined;

  const curveNodesMap = parseAnimationCurveNodes( FBXTree );

  parseAnimationCurves( FBXTree, connections, curveNodesMap );

  const layersMap = parseAnimationLayers( FBXTree, connections, curveNodesMap );
  const rawClips = parseAnimStacks( FBXTree, connections, layersMap );

  return rawClips;

}

// parse nodes in FBXTree.Objects.AnimationCurveNode
// each AnimationCurveNode holds data for an animation transform for a model (e.g. left arm rotation )
// and is referenced by an AnimationLayer
function parseAnimationCurveNodes( FBXTree ) {

  const rawCurveNodes = FBXTree.Objects.AnimationCurveNode;

  const curveNodesMap = new Map();

  for ( const nodeID in rawCurveNodes ) {

    const rawCurveNode = rawCurveNodes[ nodeID ];

    if ( rawCurveNode.attrName.match( /S|R|T/ ) !== null ) {

      const curveNode = {

        id: rawCurveNode.id,
        attr: rawCurveNode.attrName,
        curves: {},

      };

      curveNodesMap.set( curveNode.id, curveNode );

    }

  }

  return curveNodesMap;

}

// parse nodes in FBXTree.Objects.AnimationCurve and connect them up to
// previously parsed AnimationCurveNodes. Each AnimationCurve holds data for a single animated
// axis ( e.g. times and values of x rotation)
function parseAnimationCurves( FBXTree, connections, curveNodesMap ) {

  const rawCurves = FBXTree.Objects.AnimationCurve;

  for ( const nodeID in rawCurves ) {

    const animationCurve = {

      id: rawCurves[ nodeID ].id,
      times: rawCurves[ nodeID ].KeyTime.a.map( convertFBXTimeToSeconds ),
      values: rawCurves[ nodeID ].KeyValueFloat.a,

    };

    const relationships = connections.get( animationCurve.id );

    if ( relationships !== undefined ) {

      const animationCurveID = relationships.parents[ 0 ].ID;
      const animationCurveRelationship = relationships.parents[ 0 ].relationship;
      let axis = '';

      if ( animationCurveRelationship.match( /X/ ) ) {

        axis = 'x';

      } else if ( animationCurveRelationship.match( /Y/ ) ) {

        axis = 'y';

      } else if ( animationCurveRelationship.match( /Z/ ) ) {

        axis = 'z';

      } else {

        continue;

      }

      curveNodesMap.get( animationCurveID ).curves[ axis ] = animationCurve;

    }

  }

}

// parse nodes in FBXTree.Objects.AnimationLayer. Each layers holds references
// to various AnimationCurveNodes and is referenced by an AnimationStack node
// note: theoretically a stack can multiple layers, however in practice there always seems to be one per stack
function parseAnimationLayers( FBXTree, connections, curveNodesMap ) {

  const rawLayers = FBXTree.Objects.AnimationLayer;

  const layersMap = new Map();

  for ( const nodeID in rawLayers ) {

    var layerCurveNodes = [];

    const connection = connections.get( parseInt( nodeID ) );

    if ( connection !== undefined ) {

      // all the animationCurveNodes used in the layer
      const children = connection.children;

      children.forEach( ( child, i ) => {

        if ( curveNodesMap.has( child.ID ) ) {

          const curveNode = curveNodesMap.get( child.ID );

          if ( layerCurveNodes[ i ] === undefined ) {

            let modelID;

            connections.get( child.ID ).parents.forEach( ( parent ) => {

              if ( parent.relationship !== undefined ) modelID = parent.ID;

            } );

            const rawModel = FBXTree.Objects.Model[ modelID.toString() ];

            const node = {

              modelName: PropertyBinding.sanitizeNodeName( rawModel.attrName ),
              initialPosition: [ 0, 0, 0 ],
              initialRotation: [ 0, 0, 0 ],
              initialScale: [ 1, 1, 1 ],

            };

            if ( 'Lcl_Translation' in rawModel ) node.initialPosition = rawModel.Lcl_Translation.value;

            if ( 'Lcl_Rotation' in rawModel ) node.initialRotation = rawModel.Lcl_Rotation.value;

            if ( 'Lcl_Scaling' in rawModel ) node.initialScale = rawModel.Lcl_Scaling.value;

            // if the animated model is pre rotated, we'll have to apply the pre rotations to every
            // animation value as well
            if ( 'PreRotation' in rawModel ) node.preRotations = rawModel.PreRotation.value;

            layerCurveNodes[ i ] = node;

          }

          layerCurveNodes[ i ][ curveNode.attr ] = curveNode;

        }

      } );

      layersMap.set( parseInt( nodeID ), layerCurveNodes );

    }

  }

  return layersMap;

}

// parse nodes in FBXTree.Objects.AnimationStack. These are the top level node in the animation
// hierarchy. Each Stack node will be used to create a AnimationClip
function parseAnimStacks( FBXTree, connections, layersMap ) {

  const rawStacks = FBXTree.Objects.AnimationStack;

  // connect the stacks (clips) up to the layers
  const rawClips = {};

  for ( const nodeID in rawStacks ) {

    const children = connections.get( parseInt( nodeID ) ).children;

    if ( children.length > 1 ) {

      // it seems like stacks will always be associated with a single layer. But just in case there are files
      // where there are multiple layers per stack, we'll display a warning
      console.warn( 'FBXLoader: Encountered an animation stack with multiple layers, this is currently not supported. Ignoring subsequent layers.' );

    }

    const layer = layersMap.get( children[ 0 ].ID );

    rawClips[ nodeID ] = {

      name: rawStacks[ nodeID ].attrName,
      layer,

    };

  }

  return rawClips;

}

// take raw animation data from parseAnimations and connect it up to the loaded models
function addAnimations( FBXTree, connections, sceneGraph ) {

  sceneGraph.animations = [];

  const rawClips = parseAnimations( FBXTree, connections );

  if ( rawClips === undefined ) return;


  for ( const key in rawClips ) {

    const rawClip = rawClips[ key ];

    const clip = addClip( rawClip );

    sceneGraph.animations.push( clip );

  }

}

function addClip( rawClip ) {

  let tracks = [];

  rawClip.layer.forEach( ( rawTracks ) => {

    tracks = tracks.concat( generateTracks( rawTracks ) );

  } );

  return new AnimationClip( rawClip.name, -1, tracks );

}

function generateTracks( rawTracks ) {

  const tracks = [];

  if ( rawTracks.T !== undefined && Object.keys( rawTracks.T.curves ).length > 0 ) {

    const positionTrack = generateVectorTrack( rawTracks.modelName, rawTracks.T.curves, rawTracks.initialPosition, 'position' );
    if ( positionTrack !== undefined ) tracks.push( positionTrack );

  }

  if ( rawTracks.R !== undefined && Object.keys( rawTracks.R.curves ).length > 0 ) {

    const rotationTrack = generateRotationTrack( rawTracks.modelName, rawTracks.R.curves, rawTracks.initialRotation, rawTracks.preRotations );
    if ( rotationTrack !== undefined ) tracks.push( rotationTrack );

  }

  if ( rawTracks.S !== undefined && Object.keys( rawTracks.S.curves ).length > 0 ) {

    const scaleTrack = generateVectorTrack( rawTracks.modelName, rawTracks.S.curves, rawTracks.initialScale, 'scale' );
    if ( scaleTrack !== undefined ) tracks.push( scaleTrack );

  }

  return tracks;

}

function generateVectorTrack( modelName, curves, initialValue, type ) {

  const times = getTimesForAllAxes( curves );
  const values = getKeyframeTrackValues( times, curves, initialValue );

  return new VectorKeyframeTrack( modelName + '.' + type, times, values );

}

function generateRotationTrack( modelName, curves, initialValue, preRotations ) {

  if ( curves.x !== undefined ) curves.x.values = curves.x.values.map( _Math.degToRad );
  if ( curves.y !== undefined ) curves.y.values = curves.y.values.map( _Math.degToRad );
  if ( curves.z !== undefined ) curves.z.values = curves.z.values.map( _Math.degToRad );

  const times = getTimesForAllAxes( curves );
  const values = getKeyframeTrackValues( times, curves, initialValue );

  if ( preRotations !== undefined ) {

    preRotations = preRotations.map( _Math.degToRad );
    preRotations.push( 'ZYX' );

    preRotations = new Euler().fromArray( preRotations );
    preRotations = new Quaternion().setFromEuler( preRotations );

  }

  const quaternion = new Quaternion();
  const euler = new Euler();

  const quaternionValues = [];

  for ( let i = 0; i < values.length; i += 3 ) {

    euler.set( values[ i ], values[ i + 1 ], values[ i + 2 ], 'ZYX' );

    quaternion.setFromEuler( euler );

    if ( preRotations !== undefined )quaternion.premultiply( preRotations );

    quaternion.toArray( quaternionValues, ( i / 3 ) * 4 );

  }

  return new QuaternionKeyframeTrack( modelName + '.quaternion', times, quaternionValues );

}

function getKeyframeTrackValues( times, curves, initialValue ) {

  const prevValue = initialValue;

  const values = [];

  let xIndex = -1;
  let yIndex = -1;
  let zIndex = -1;

  times.forEach( ( time ) => {

    if ( curves.x ) xIndex = curves.x.times.indexOf( time );
    if ( curves.y ) yIndex = curves.y.times.indexOf( time );
    if ( curves.z ) zIndex = curves.z.times.indexOf( time );

    // if there is an x value defined for this frame, use that
    if ( xIndex !== -1 ) {

      const xValue = curves.x.values[ xIndex ];
      values.push( xValue );
      prevValue[ 0 ] = xValue;

    } else {

      // otherwise use the x value from the previous frame
      values.push( prevValue[ 0 ] );

    }

    if ( yIndex !== -1 ) {

      const yValue = curves.y.values[ yIndex ];
      values.push( yValue );
      prevValue[ 1 ] = yValue;

    } else {

      values.push( prevValue[ 1 ] );

    }

    if ( zIndex !== -1 ) {

      const zValue = curves.z.values[ zIndex ];
      values.push( zValue );
      prevValue[ 2 ] = zValue;

    } else {

      values.push( prevValue[ 2 ] );

    }

  } );

  return values;

}

// For all animated objects, times are defined separately for each axis
// Here we'll combine the times into one sorted array without duplicates
function getTimesForAllAxes( curves ) {

  let times = [];

  // first join together the times for each axis, if defined
  if ( curves.x !== undefined ) times = times.concat( curves.x.times );
  if ( curves.y !== undefined ) times = times.concat( curves.y.times );
  if ( curves.z !== undefined ) times = times.concat( curves.z.times );

  // then sort them and remove duplicates
  times = times.sort( ( a, b ) => {

    return a - b;

  } ).filter( ( elem, index, array ) => {

    return array.indexOf( elem ) == index;

  } );

  return times;

}

// parse an FBX file in ASCII format
function TextParser() {}

Object.assign( TextParser.prototype, {

  getPrevNode() {

    return this.nodeStack[ this.currentIndent - 2 ];

  },

  getCurrentNode() {

    return this.nodeStack[ this.currentIndent - 1 ];

  },

  getCurrentProp() {

    return this.currentProp;

  },

  pushStack( node ) {

    this.nodeStack.push( node );
    this.currentIndent += 1;

  },

  popStack() {

    this.nodeStack.pop();
    this.currentIndent -= 1;

  },

  setCurrentProp( val, name ) {

    this.currentProp = val;
    this.currentPropName = name;

  },

  parse( text ) {

    this.currentIndent = 0;
    this.allNodes = new FBXTree();
    this.nodeStack = [];
    this.currentProp = [];
    this.currentPropName = '';

    const self = this;

    const split = text.split( '\n' );

    split.forEach( ( line, i ) => {

      const matchComment = line.match( /^[\s\t]*;/ );
      const matchEmpty = line.match( /^[\s\t]*$/ );

      if ( matchComment || matchEmpty ) return;

      const matchBeginning = line.match( '^\\t{' + self.currentIndent + '}(\\w+):(.*){', '' );
      const matchProperty = line.match( '^\\t{' + ( self.currentIndent ) + '}(\\w+):[\\s\\t\\r\\n](.*)' );
      const matchEnd = line.match( '^\\t{' + ( self.currentIndent - 1 ) + '}}' );

      if ( matchBeginning ) {

        self.parseNodeBegin( line, matchBeginning );

      } else if ( matchProperty ) {

        self.parseNodeProperty( line, matchProperty, split[ ++i ] );

      } else if ( matchEnd ) {

        self.popStack();

      } else if ( line.match( /^[^\s\t}]/ ) ) {

        // large arrays are split over multiple lines terminated with a ',' character
        // if this is encountered the line needs to be joined to the previous line
        self.parseNodePropertyContinued( line );

      }

    } );

    return this.allNodes;

  },

  parseNodeBegin( line, property ) {

    const nodeName = property[ 1 ].trim().replace( /^"/, '' ).replace( /"$/, '' );

    const nodeAttrs = property[ 2 ].split( ',' ).map( ( attr ) => {

      return attr.trim().replace( /^"/, '' ).replace( /"$/, '' );

    } );

    const node = { name: nodeName };
    const attrs = this.parseNodeAttr( nodeAttrs );

    const currentNode = this.getCurrentNode();

    // a top node
    if ( this.currentIndent === 0 ) {

      this.allNodes.add( nodeName, node );

    } else { // a subnode

      // if the subnode already exists, append it
      if ( nodeName in currentNode ) {

        // special case Pose needs PoseNodes as an array
        if ( nodeName === 'PoseNode' ) {

          currentNode.PoseNode.push( node );

        } else if ( currentNode[ nodeName ].id !== undefined ) {

          currentNode[ nodeName ] = {};
          currentNode[ nodeName ][ currentNode[ nodeName ].id ] = currentNode[ nodeName ];

        }

        if ( attrs.id !== '' ) currentNode[ nodeName ][ attrs.id ] = node;

      } else if ( typeof attrs.id === 'number' ) {

        currentNode[ nodeName ] = {};
        currentNode[ nodeName ][ attrs.id ] = node;

      } else if ( nodeName !== 'Properties70' ) {

        if ( nodeName === 'PoseNode' )	currentNode[ nodeName ] = [ node ];
        else currentNode[ nodeName ] = node;

      }

    }

    if ( typeof attrs.id === 'number' ) node.id = attrs.id;
    if ( attrs.name !== '' ) node.attrName = attrs.name;
    if ( attrs.type !== '' ) node.attrType = attrs.type;

    this.pushStack( node );

  },

  parseNodeAttr( attrs ) {

    let id = attrs[ 0 ];

    if ( attrs[ 0 ] !== '' ) {

      id = parseInt( attrs[ 0 ] );

      if ( isNaN( id ) ) {

        id = attrs[ 0 ];

      }

    }

    let name = '', type = '';

    if ( attrs.length > 1 ) {

      name = attrs[ 1 ].replace( /^(\w+)::/, '' );
      type = attrs[ 2 ];

    }

    return { id, name, type };

  },

  parseNodeProperty( line, property, contentLine ) {

    let propName = property[ 1 ].replace( /^"/, '' ).replace( /"$/, '' ).trim();
    let propValue = property[ 2 ].replace( /^"/, '' ).replace( /"$/, '' ).trim();

    // for special case: base64 image data follows "Content: ," line
    //	Content: ,
    //	 "/9j/4RDaRXhpZgAATU0A..."
    if ( propName === 'Content' && propValue === ',' ) {

      propValue = contentLine.replace( /"/g, '' ).replace( /,$/, '' ).trim();

    }

    const currentNode = this.getCurrentNode();
    const parentName = currentNode.name;

    if ( parentName === 'Properties70' ) {

      this.parseNodeSpecialProperty( line, propName, propValue );
      return;

    }

    // Connections
    if ( propName === 'C' ) {

      const connProps = propValue.split( ',' ).slice( 1 );
      const from = parseInt( connProps[ 0 ] );
      const to = parseInt( connProps[ 1 ] );

      let rest = propValue.split( ',' ).slice( 3 );

      rest = rest.map( ( elem ) => {

        return elem.trim().replace( /^"/, '' );

      } );

      propName = 'connections';
      propValue = [ from, to ];
      append( propValue, rest );

      if ( currentNode[ propName ] === undefined ) {

        currentNode[ propName ] = [];

      }

    }

    // Node
    if ( propName === 'Node' ) currentNode.id = propValue;

    // connections
    if ( propName in currentNode && Array.isArray( currentNode[ propName ] ) ) {

      currentNode[ propName ].push( propValue );

    } else if ( propName !== 'a' ) currentNode[ propName ] = propValue;
    else currentNode.a = propValue;

    this.setCurrentProp( currentNode, propName );

    // convert string to array, unless it ends in ',' in which case more will be added to it
    if ( propName === 'a' && propValue.slice( -1 ) !== ',' ) {

      currentNode.a = parseNumberArray( propValue );

    }

  },

  parseNodePropertyContinued( line ) {

    const currentNode = this.getCurrentNode();

    currentNode.a += line;

    // if the line doesn't end in ',' we have reached the end of the property value
    // so convert the string to an array
    if ( line.slice( -1 ) !== ',' ) {

      currentNode.a = parseNumberArray( currentNode.a );

    }

  },

  // parse "Property70"
  parseNodeSpecialProperty( line, propName, propValue ) {

    // split this
    // P: "Lcl Scaling", "Lcl Scaling", "", "A",1,1,1
    // into array like below
    // ["Lcl Scaling", "Lcl Scaling", "", "A", "1,1,1" ]
    const props = propValue.split( '",' ).map( ( prop ) => {

      return prop.trim().replace( /^\"/, '' ).replace( /\s/, '_' );

    } );

    const innerPropName = props[ 0 ];
    const innerPropType1 = props[ 1 ];
    const innerPropType2 = props[ 2 ];
    const innerPropFlag = props[ 3 ];
    let innerPropValue = props[ 4 ];

    // cast values where needed, otherwise leave as strings
    switch ( innerPropType1 ) {

      case 'int':
      case 'enum':
      case 'bool':
      case 'ULongLong':
      case 'double':
      case 'Number':
      case 'FieldOfView':
        innerPropValue = parseFloat( innerPropValue );
        break;

      case 'ColorRGB':
      case 'Vector3D':
      case 'Lcl_Translation':
      case 'Lcl_Rotation':
      case 'Lcl_Scaling':
        innerPropValue = parseNumberArray( innerPropValue );
        break;

    }

    // CAUTION: these props must append to parent's parent
    this.getPrevNode()[ innerPropName ] = {

      type: innerPropType1,
      type2: innerPropType2,
      flag: innerPropFlag,
      value: innerPropValue,

    };

    this.setCurrentProp( this.getPrevNode(), innerPropName );

  },

} );

// Parse an FBX file in Binary format
function BinaryParser() {}

Object.assign( BinaryParser.prototype, {

  parse( buffer ) {

    const reader = new BinaryReader( buffer );
    reader.skip( 23 ); // skip magic 23 bytes

    const version = reader.getUint32();

    console.log( 'FBXLoader: FBX binary version: ' + version );

    const allNodes = new FBXTree();

    while ( !this.endOfContent( reader ) ) {

      const node = this.parseNode( reader, version );
      if ( node !== null ) allNodes.add( node.name, node );

    }

    return allNodes;

  },

  // Check if reader has reached the end of content.
  endOfContent( reader ) {

    // footer size: 160bytes + 16-byte alignment padding
    // - 16bytes: magic
    // - padding til 16-byte alignment (at least 1byte?)
    //	(seems like some exporters embed fixed 15 or 16bytes?)
    // - 4bytes: magic
    // - 4bytes: version
    // - 120bytes: zero
    // - 16bytes: magic
    if ( reader.size() % 16 === 0 ) {

      return ( ( reader.getOffset() + 160 + 16 ) & ~0xf ) >= reader.size();

    }

    return reader.getOffset() + 160 + 16 >= reader.size();


  },

  // recursively parse nodes until the end of the file is reached
  parseNode( reader, version ) {

    const node = {};

    // The first three data sizes depends on version.
    const endOffset = ( version >= 7500 ) ? reader.getUint64() : reader.getUint32();
    const numProperties = ( version >= 7500 ) ? reader.getUint64() : reader.getUint32();

    // note: do not remove this even if you get a linter warning as it moves the buffer forward
    const propertyListLen = ( version >= 7500 ) ? reader.getUint64() : reader.getUint32();

    const nameLen = reader.getUint8();
    const name = reader.getString( nameLen );

    // Regards this node as NULL-record if endOffset is zero
    if ( endOffset === 0 ) return null;

    const propertyList = [];

    for ( let i = 0; i < numProperties; i++ ) {

      propertyList.push( this.parseProperty( reader ) );

    }

    // Regards the first three elements in propertyList as id, attrName, and attrType
    const id = propertyList.length > 0 ? propertyList[ 0 ] : '';
    const attrName = propertyList.length > 1 ? propertyList[ 1 ] : '';
    const attrType = propertyList.length > 2 ? propertyList[ 2 ] : '';

    // check if this node represents just a single property
    // like (name, 0) set or (name2, [0, 1, 2]) set of {name: 0, name2: [0, 1, 2]}
    node.singleProperty = !!( ( numProperties === 1 && reader.getOffset() === endOffset ) );

    while ( endOffset > reader.getOffset() ) {

      const subNode = this.parseNode( reader, version );

      if ( subNode !== null ) this.parseSubNode( name, node, subNode );

    }

    node.propertyList = propertyList; // raw property list used by parent

    if ( typeof id === 'number' ) node.id = id;
    if ( attrName !== '' ) node.attrName = attrName;
    if ( attrType !== '' ) node.attrType = attrType;
    if ( name !== '' ) node.name = name;

    return node;

  },

  parseSubNode( name, node, subNode ) {

    // special case: child node is single property
    if ( subNode.singleProperty === true ) {

      const value = subNode.propertyList[ 0 ];

      if ( Array.isArray( value ) ) {

        node[ subNode.name ] = subNode;

        subNode.a = value;

      } else {

        node[ subNode.name ] = value;

      }

    } else if ( name === 'Connections' && subNode.name === 'C' ) {

      const array = [];

      subNode.propertyList.forEach( ( property, i ) => {

        // first Connection is FBX type (OO, OP, etc.). We'll discard these
        if ( i !== 0 ) array.push( property );

      } );

      if ( node.connections === undefined ) {

        node.connections = [];

      }

      node.connections.push( array );

    } else if ( subNode.name === 'Properties70' ) {

      const keys = Object.keys( subNode );

      keys.forEach( ( key ) => {

        node[ key ] = subNode[ key ];

      } );

    } else if ( name === 'Properties70' && subNode.name === 'P' ) {

      let innerPropName = subNode.propertyList[ 0 ];
      let innerPropType1 = subNode.propertyList[ 1 ];
      const innerPropType2 = subNode.propertyList[ 2 ];
      const innerPropFlag = subNode.propertyList[ 3 ];
      let innerPropValue;

      if ( innerPropName.indexOf( 'Lcl ' ) === 0 ) innerPropName = innerPropName.replace( 'Lcl ', 'Lcl_' );
      if ( innerPropType1.indexOf( 'Lcl ' ) === 0 ) innerPropType1 = innerPropType1.replace( 'Lcl ', 'Lcl_' );

      if ( innerPropType1 === 'ColorRGB' || innerPropType1 === 'Vector' || innerPropType1 === 'Vector3D' || innerPropType1.indexOf( 'Lcl_' ) === 0 ) {

        innerPropValue = [
          subNode.propertyList[ 4 ],
          subNode.propertyList[ 5 ],
          subNode.propertyList[ 6 ],
        ];

      } else {

        innerPropValue = subNode.propertyList[ 4 ];

      }

      // this will be copied to parent, see above
      node[ innerPropName ] = {

        type: innerPropType1,
        type2: innerPropType2,
        flag: innerPropFlag,
        value: innerPropValue,

      };

    } else if ( node[ subNode.name ] === undefined ) {

      if ( typeof subNode.id === 'number' ) {

        node[ subNode.name ] = {};
        node[ subNode.name ][ subNode.id ] = subNode;

      } else {

        node[ subNode.name ] = subNode;

      }

    } else if ( subNode.name === 'PoseNode' ) {

      if ( !Array.isArray( node[ subNode.name ] ) ) {

        node[ subNode.name ] = [ node[ subNode.name ] ];

      }

      node[ subNode.name ].push( subNode );

    } else if ( node[ subNode.name ][ subNode.id ] === undefined ) {

      node[ subNode.name ][ subNode.id ] = subNode;

    }

  },

  parseProperty( reader ) {

    const type = reader.getString( 1 );

    switch ( type ) {

      case 'C':
        return reader.getBoolean();

      case 'D':
        return reader.getFloat64();

      case 'F':
        return reader.getFloat32();

      case 'I':
        return reader.getInt32();

      case 'L':
        return reader.getInt64();

      case 'R':
        var length = reader.getUint32();
        return reader.getArrayBuffer( length );

      case 'S':
        var length = reader.getUint32();
        return reader.getString( length );

      case 'Y':
        return reader.getInt16();

      case 'b':
      case 'c':
      case 'd':
      case 'f':
      case 'i':
      case 'l':

        var arrayLength = reader.getUint32();
        var encoding = reader.getUint32(); // 0: non-compressed, 1: compressed
        var compressedLength = reader.getUint32();

        if ( encoding === 0 ) {

          switch ( type ) {

            case 'b':
            case 'c':
              return reader.getBooleanArray( arrayLength );

            case 'd':
              return reader.getFloat64Array( arrayLength );

            case 'f':
              return reader.getFloat32Array( arrayLength );

            case 'i':
              return reader.getInt32Array( arrayLength );

            case 'l':
              return reader.getInt64Array( arrayLength );

          }

        }

        if ( window.Zlib === undefined ) {

          throw new Error( 'FBXLoader: External library Inflate.min.js required, obtain or import from https://github.com/imaya/zlib.js' );

        }

        var inflate = new Zlib.Inflate( new Uint8Array( reader.getArrayBuffer( compressedLength ) ) ); // eslint-disable-line no-undef
        var reader2 = new BinaryReader( inflate.decompress().buffer );

        switch ( type ) {

          case 'b':
          case 'c':
            return reader2.getBooleanArray( arrayLength );

          case 'd':
            return reader2.getFloat64Array( arrayLength );

          case 'f':
            return reader2.getFloat32Array( arrayLength );

          case 'i':
            return reader2.getInt32Array( arrayLength );

          case 'l':
            return reader2.getInt64Array( arrayLength );

        }

      default:
        throw new Error( 'FBXLoader: Unknown property type ' + type );

    }

  },

} );


function BinaryReader( buffer, littleEndian ) {

  this.dv = new DataView( buffer );
  this.offset = 0;
  this.littleEndian = ( littleEndian !== undefined ) ? littleEndian : true;

}

Object.assign( BinaryReader.prototype, {

  getOffset() {

    return this.offset;

  },

  size() {

    return this.dv.buffer.byteLength;

  },

  skip( length ) {

    this.offset += length;

  },

  // seems like true/false representation depends on exporter.
  // true: 1 or 'Y'(=0x59), false: 0 or 'T'(=0x54)
  // then sees LSB.
  getBoolean() {

    return ( this.getUint8() & 1 ) === 1;

  },

  getBooleanArray( size ) {

    const a = [];

    for ( let i = 0; i < size; i++ ) {

      a.push( this.getBoolean() );

    }

    return a;

  },

  getUint8() {

    const value = this.dv.getUint8( this.offset );
    this.offset += 1;
    return value;

  },

  getInt16() {

    const value = this.dv.getInt16( this.offset, this.littleEndian );
    this.offset += 2;
    return value;

  },

  getInt32() {

    const value = this.dv.getInt32( this.offset, this.littleEndian );
    this.offset += 4;
    return value;

  },

  getInt32Array( size ) {

    const a = [];

    for ( let i = 0; i < size; i++ ) {

      a.push( this.getInt32() );

    }

    return a;

  },

  getUint32() {

    const value = this.dv.getUint32( this.offset, this.littleEndian );
    this.offset += 4;
    return value;

  },

  // JavaScript doesn't support 64-bit integer so calculate this here
  // 1 << 32 will return 1 so using multiply operation instead here.
  // There's a possibility that this method returns wrong value if the value
  // is out of the range between Number.MAX_SAFE_INTEGER and Number.MIN_SAFE_INTEGER.
  // TODO: safely handle 64-bit integer
  getInt64() {

    let low, high;

    if ( this.littleEndian ) {

      low = this.getUint32();
      high = this.getUint32();

    } else {

      high = this.getUint32();
      low = this.getUint32();

    }

    // calculate negative value
    if ( high & 0x80000000 ) {

      high = ~high & 0xFFFFFFFF;
      low = ~low & 0xFFFFFFFF;

      if ( low === 0xFFFFFFFF ) high = ( high + 1 ) & 0xFFFFFFFF;

      low = ( low + 1 ) & 0xFFFFFFFF;

      return -( high * 0x100000000 + low );

    }

    return high * 0x100000000 + low;

  },

  getInt64Array( size ) {

    const a = [];

    for ( let i = 0; i < size; i++ ) {

      a.push( this.getInt64() );

    }

    return a;

  },

  // Note: see getInt64() comment
  getUint64() {

    let low, high;

    if ( this.littleEndian ) {

      low = this.getUint32();
      high = this.getUint32();

    } else {

      high = this.getUint32();
      low = this.getUint32();

    }

    return high * 0x100000000 + low;

  },

  getFloat32() {

    const value = this.dv.getFloat32( this.offset, this.littleEndian );
    this.offset += 4;
    return value;

  },

  getFloat32Array( size ) {

    const a = [];

    for ( let i = 0; i < size; i++ ) {

      a.push( this.getFloat32() );

    }

    return a;

  },

  getFloat64() {

    const value = this.dv.getFloat64( this.offset, this.littleEndian );
    this.offset += 8;
    return value;

  },

  getFloat64Array( size ) {

    const a = [];

    for ( let i = 0; i < size; i++ ) {

      a.push( this.getFloat64() );

    }

    return a;

  },

  getArrayBuffer( size ) {

    const value = this.dv.buffer.slice( this.offset, this.offset + size );
    this.offset += size;
    return value;

  },

  getString( size ) {

    let a = new Uint8Array( size );

    for ( let i = 0; i < size; i++ ) {

      a[ i ] = this.getUint8();

    }

    const nullByte = a.indexOf( 0 );
    if ( nullByte >= 0 ) a = a.slice( 0, nullByte );

    return LoaderUtils.decodeText( a );

  },

} );

// FBXTree holds a representation of the FBX data, returned by the TextParser ( FBX ASCII format)
// and BinaryParser( FBX Binary format)
function FBXTree() {}

Object.assign( FBXTree.prototype, {

  add( key, val ) {

    this[ key ] = val;

  },

} );

function isFbxFormatBinary( buffer ) {

  const CORRECT = 'Kaydara FBX Binary  \0';

  return buffer.byteLength >= CORRECT.length && CORRECT === convertArrayBufferToString( buffer, 0, CORRECT.length );

}

function isFbxFormatASCII( text ) {

  const CORRECT = [ 'K', 'a', 'y', 'd', 'a', 'r', 'a', '\\', 'F', 'B', 'X', '\\', 'B', 'i', 'n', 'a', 'r', 'y', '\\', '\\' ];

  let cursor = 0;

  function read( offset ) {

    const result = text[ offset - 1 ];
    text = text.slice( cursor + offset );
    cursor++;
    return result;

  }

  for ( let i = 0; i < CORRECT.length; ++i ) {

    const num = read( 1 );
    if ( num === CORRECT[ i ] ) {

      return false;

    }

  }

  return true;

}

function getFbxVersion( text ) {

  const versionRegExp = /FBXVersion: (\d+)/;
  const match = text.match( versionRegExp );
  if ( match ) {

    const version = parseInt( match[ 1 ] );
    return version;

  }
  throw new Error( 'FBXLoader: Cannot find the version number for the file given.' );

}

// Converts FBX ticks into real time seconds.
function convertFBXTimeToSeconds( time ) {

  return time / 46186158000;

}


// Parses comma separated list of numbers and returns them an array.
// Used internally by the TextParser
function parseNumberArray( value ) {

  const array = value.split( ',' ).map( ( val ) => {

    return parseFloat( val );

  } );

  return array;

}

function parseColor( property ) {

  const color = new Color();

  if ( property.type === 'Color' ) {

    return color.setScalar( property.value );

  }

  return color.fromArray( property.value );

}

function convertArrayBufferToString( buffer, from, to ) {

  if ( from === undefined ) from = 0;
  if ( to === undefined ) to = buffer.byteLength;

  return LoaderUtils.decodeText( new Uint8Array( buffer, from, to ) );

}

function append( a, b ) {

  for ( let i = 0, j = a.length, l = b.length; i < l; i++, j++ ) {

    a[ j ] = b[ i ];

  }

}

function slice( a, b, from, to ) {

  for ( let i = from, j = 0; i < to; i++, j++ ) {

    a[ j ] = b[ i ];

  }

  return a;

}
