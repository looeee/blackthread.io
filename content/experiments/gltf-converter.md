---
title: "Convert to GLTF using the three.js exporter"
date: 2018-03-03T00:00:00-00:00
description: "GLTF is the up and coming superstar of 3D model formats - you can even display it on the Facebook news feed. Use this tool to convert from various formats to GLTF using the three.js exporter"
tags: ['gltf', 'three.js', 'converter', 'exporter', 'fbx', 'obj', 'mtl', 'dae', 'collada', 'dds']
# teaserImage: /images/converters/teaser.jpg
js: converters
css: converters
menu: experiments
menuTitle: Blackthread Experiments
weight: 1
vendorScripts:
  [
  "/inflate.min",
  "/three/build/three.min",
  '/three/examples/js/loaders/DDSLoader.min',
  '/three/examples/js/loaders/FBXLoader.min',
  '/three/examples/js/loaders/GLTFLoader',
  '/three/examples/js/exporters/GLTFExporter',
  '/three/examples/js/loaders/LoaderSupport.min',
  '/three/examples/js/loaders/OBJLoader.min',
  '/three/examples/js/loaders/MTLLoader.min',
  '/three/examples/js/loaders/ColladaLoader.min',
  '/three/examples/js/controls/OrbitControls.min'
   ]
# draft: true
---

GLTF is the up and coming superstar of 3D model formats - as of March 2018 you can even display it on the Facebook news feed!

Convert from a variety of formats to GLTF format using the three.js <a href="https://threejs.org/examples/#misc_exporter_gltf">GLTFExporter</a>. Currently this supports FBX, OBJ, GLTF and GLB  (because why not?) and Collada ( DAE ).
Upload textures in JPG, PNG, GIF, BMP or DDS format.

See the [docs](https://threejs.org/docs/#examples/exporters/GLTFExporter) page for details of the options below.

<div class="border-section">
  <div id="file-upload-form">
    <input id="file-upload-input" type="file" name="files[]" multiple="" class="hide">
    <input type="submit" value="Upload or Drop Files Here" id="file-upload-button"/>
    <div id="options">
      <input id="option_animations" name="visible" type="checkbox" checked><span>Include Animations</span><br>
      <input id="option_binary" name="visible" type="checkbox" checked><span>Binary (.glb)</span><br>
      <input id="option_visible" name="visible" type="checkbox" checked/><span>Export only visible objects</span><br>
      <input id="option_embedImages" name="visible" type="checkbox" checked><span>Embed Images</span><br>
      <!-- <input id="option_forceindices" name="visible" type="checkbox"><span>Force indices</span><br> -->
      <input id="option_trs" name="trs" type="checkbox"/><span>Export position, rotation and scale instead of matrix per node</span><br>
      <input id="option_drawrange" name="visible" type="checkbox" checked="checked"/><span>Export just the attributes within the drawRange, if defined, instead of exporting the whole array.</span><br>
    </div>
    <input type="submit" value="Export as GLTF" id="export" disabled/>
    <div id="errors" class="hide"></div>
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
