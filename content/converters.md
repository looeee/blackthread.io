---
title: "Convert various file formats to GLTF"
date: 2018-03-03T00:00:00-00:00
description: "GLTF is the up and coming superstar of 3D model formats - you can even display it on the Facebook news feed."
tags: ['gltf', 'three.js', 'obj2gltf', 'converter']
# teaserImage: /images/converters/teaser.jpg
js: converters
type: page
layout: fullWidth
# css: loader
# menu: experiments
# menuTitle: Blackthread Experiments
# weight: 3
vendorScripts:
  [
  "/inflate.min",
  "/three/build/three.min",
  '/three/examples/js/loaders/DDSLoader.min',
  '/three/examples/js/loaders/FBXLoader.min',
  '/three/examples/js/loaders/GLTFLoader.min',
  '/three/examples/js/loaders/LoaderSupport.min',
  '/three/examples/js/loaders/OBJLoader.min',
  '/three/examples/js/loaders/MTLLoader.min',
  '/three/examples/js/loaders/ColladaLoader.min',
  '/three/examples/js/controls/OrbitControls.min',
  '/three/examples/js/exporters/GLTFExporter.min'
   ]
draft: true
---
<h1 class="text-center">Convert to GLTF using the three.js exporter</h1><br>
<p>
  GLTF is the up and coming superstar of 3D model formats - you can even display it on the Facebook news feed!
</p>
<p>
  Convert from a variety of formats to GLTF format using the three.js <a href="https://threejs.org/examples/#misc_exporter_gltf">GLTFExporter</a>. Currently this supports FBX, OBJ, GLTF and GLB  (because why not?) and Collada ( DAE ).
  Upload textures in JPG, PNG, GIF, BMP or DDS format.
</p>
<p>
  See the [docs](https://threejs.org/docs/#examples/exporters/GLTFExporter) page for details of the options below.
</p><br>
<div class="border-section">
  <br>
  <div id="file-upload-form">
    <input id="file-upload-input" type="file" name="files[]" multiple="" class="hide">
    <input type="submit" value="Upload or Drop Files Here" id="file-upload-button"/>
    <div id="errors" class="hide">
    <p>You model uses multiple materials on a single mesh. That is currently not supported by the three.js supporter, although it will be soon!</p>
    </div>
  </div>
  <div id="preview-options">
    <div id="option">
      <input id="option_trs" name="trs" type="checkbox"/><span>TRS</span><br>
      <input id="option_visible" name="visible" type="checkbox" checked/><span>Only Visible</span><br>
      <input id="option_drawrange" name="visible" type="checkbox" checked="checked"/><span>Truncate drawRange</span><br>
      <input id="option_binary" name="visible" type="checkbox" checked><span>Binary (.glb)</span><br>
      <input id="option_forceindices" name="visible" type="checkbox"><span>Force indices</span><br>
      <input id="option_forcepot" name="visible" type="checkbox"><span>Force POT textures</span><br><br>
      <button id="export" disabled>Export Now</button>
    </div>
    <div id="preview">
      <div id="loading-overlay" class="fill">
        <div id="loading-bar" class="hide">
          <span id="bar">
            <span id="progress"></span>
          </span>
        </div>
      </div>
      <canvas id="export-preview"></canvas>
    </div>
  </div>
</div>
