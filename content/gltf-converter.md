---
title: "Convert 3D models to GLTF"
date: 2018-03-08T00:00:00-00:00
description: "GLTF is the up and coming superstar of 3D model formats - you can even display it on the Facebook news feed. Use this tool to convert from various formats to GLTF using the three.js exporter"
tags: ['gltf', 'three.js', 'converter', 'exporter', 'fbx', 'obj', 'mtl', 'dae', 'collada', 'dds']
teaserImage: /images/experiments/gltf-converter/teaser.jpg
js: gltf-converter
css: gltf-converter
# menu: experiments
menuTitle: Blackthread Experiments
weight: 1
vendorScripts:
  [
  '/three/examples/js/libs/jszip.min',
  '/three/examples/js/libs/inflate.min',
  '/three/build/three.min',
  '/three/examples/js/controls/OrbitControls.min',
  '/three/examples/js/loaders/3MFLoader.min',
  '/three/examples/js/loaders/AMFLoader',
  # '/three/examples/js/loaders/CTMLoader' - needs lots of files!
  '/three/examples/js/loaders/ColladaLoader.min',
  '/three/examples/js/loaders/DRACOLoader.min',
  # '/three/examples/js/loaders/DDSLoader',
  '/three/examples/js/loaders/FBXLoader.min',
  '/three/examples/js/exporters/GLTFExporter',
  '/three/examples/js/loaders/GLTFLoader',
  '/three/examples/js/loaders/KMZLoader.min',
  '/three/examples/js/loaders/deprecated/LegacyGLTFLoader.min',
  '/three/examples/js/loaders/LoaderSupport.min',
  '/three/examples/js/loaders/MMDLoader.min',
  '/three/examples/js/loaders/MTLLoader.min',
  '/three/examples/js/loaders/NRRDLoader.min',
  '/three/examples/js/loaders/OBJLoader.min',
  '/three/examples/js/loaders/PCDLoader.min',
  '/three/examples/js/loaders/PDBLoader.min',
  '/three/examples/js/loaders/PLYLoader.min',
  '/three/examples/js/loaders/PRWMLoader.min',
  '/three/examples/js/loaders/STLLoader.min',
   ]
aliases: [/experiments/gltf-converter/]
# type: page
layout: fullWidthArticle
---

## Three.js based glTF Converter

glTF is the up and coming superstar of 3D model formats. It's being adopted as the standard format by many 3D applications and game engines, and is especialy prominent as
the format of choice for web applications. As of March 2018 you can even display it on the Facebook news feed!

This app allows to you allows you to convert to glTF format version using the three.js <a href="https://threejs.org/examples/#misc_exporter_gltf">GLTFExporter</a>.

### Supported formats:

* 3MF
* AMF
* FBX
* OBJ and MTL
* GLTF and GLB version 2 (because why not? )
* GLTF and GLB version 1. Upload any .BIN, .FRAG, or .VERT files alongside your model (shader materials will export as grey for now though).
* Collada ( DAE )
* Three.js JSON format.
* PCD (ASCII and Binary)
* PLY (ASCII and Binary)
* STL (ASCII and Binary)

Upload any textures alongside the model in JPG, PNG, GIF, BMP format ( just upload all the files at the same time and the converter will handle the rest ).


### Limitations

* Multimaterials are not supported. Any model that uses multimaterials will probably not export at all, although this will be fixed very soon
* The exporter currently always exports [MeshStandardMaterial](https://threejs.org/docs/#api/materials/MeshStandardMaterial). Other materials will be converted to this material type and may lose information
* Models are loaded using three.js loaders. Some of these (FBX, Collada, OBJ, glTF) support pretty much everything that you can throw at them. Others are more limited, however if you upload a model and it doesn't even display in the original preview below, you can help improve the loaders by filing a [bug report](https://github.com/mrdoob/three.js/issues) and sharing your model.

All conversion happens on your PC, at no point are any models or textues uploaded to my server or stored in any way.

<div class="border-section">
  <div id="file-upload-form">
    <input id="file-upload-input" type="file" name="files[]" multiple="" class="hide">
    <input type="submit" value="Upload or Drop Files Here" id="file-upload-button"/>
    <div id="options">
      <input id="option_animations" name="visible" type="checkbox" checked><span>Include Animations</span><br>
      <input id="option_binary" name="visible" type="checkbox" checked><span>Binary (.glb) or ASCII (.gltf)</span><br>
      <input id="option_visible" name="visible" type="checkbox" checked/><span>Export only visible objects</span><br>
      <input id="option_embedImages" name="visible" type="checkbox" checked><span>Embed Images</span><br>
      <!-- <input id="option_forceindices" name="visible" type="checkbox"><span>Force indices</span><br> -->
      <input id="option_trs" name="trs" type="checkbox"/><span>Export position, rotation and scale instead of matrix per node</span><br>
      <input id="option_drawrange" name="visible" type="checkbox" checked="checked"/><span>Export just the attributes within the drawRange, if defined, instead of exporting the whole array.</span><br>
    </div>
    <input type="submit" value="Export as GLB" id="export" disabled/>
  </div>
  <div id="previews">
    <div id="original-preview">
      <div id="original-loading-overlay" class="loading-overlay">
        <div id="original-loading-bar" class="loading-bar hide">
          <span id="original-bar" class="bar">
            <span id="original-progress" class="progress"></span>
          </span>
        </div>
      </div>
      <p id="original-preview-text">Original</p>
      <canvas id="original-preview-canvas"></canvas>
    </div>
    <div id="result-preview">
      <div id="result-loading-overlay" class="loading-overlay">
        <div id="result-loading-bar" class="loading-bar hide">
          <span id="result-bar" class="bar">
            <span id="result-progress" class="progress"></span>
          </span>
        </div>
      </div>
      <p id="result-preview-text">Result</p>
      <canvas id="result-preview-canvas"></canvas>
      <a href="#" id="fullscreen-button" title="Go fullscreen">
        <span class="fa fa-lg fa-arrows-alt" aria-hidden="true"></span>
      </a>
    </div>
  </div>
  <div id="messages" class="hide">
    <h3>Messages received</h3>
    <div id="errors-container" class="hide">
      <h5>Errors</h5>
      <div id="errors"></div>
    </div>
    <div id="warnings-container" class="hide">
      <h5>Warnings</h5>
      <div id="warnings"></div>
    </div>
    <div id="logs-container" class="hide">
      <h5>Logs</h5>
      <div id="logs"></div>
    </div>
  </div>
</div>
