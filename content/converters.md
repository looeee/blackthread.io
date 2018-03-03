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
<div class="accordion">
  <h1 class="text-center">Convert to GLTF</h1>
  <p>
    GLTF is the up and coming superstar of 3D model formats - you can even display it on the Facebook news feed! Below are a couple of options for converting files in other formats to GLTF format.
  </p>
  <ul>
    <li>
      <input type="checkbox">
      <i></i>
      <h2>The three.js exporter</h2>
      <div class="border-section">
        <p>
          Convert from a variety of formats to GLTF format using the three.js <a href="https://threejs.org/examples/#misc_exporter_gltf">GLTFExporter</a>. Currently this supports FBX, OBJ, GLTF and GLB  (because why not?) and Collada ( DAE ).
          Upload textures in JPG, PNG, GIF, BMP or DDS format.
        </p>
        <div id="file-upload-form">
          <input id="file-upload-input" type="file" name="files[]" multiple="" class="hide">
          <input type="submit" value="Upload or Drop Files Here" id="file-upload-button"/>
        </div>
        <div>
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
    </li>
    <!-- <li>
      <input type="checkbox" checked>
      <i></i>
      <h2>obj2gltf</h2>
      <div class="border-section">
        <p>
          Convert from OBJ to GLTF format. The homepage for this tool is <a href="https://github.com/AnalyticalGraphicsInc/obj2gltf">here</a>.
          You can upload an OBJ file, its associated MTL file, and any textures in JPG, PNG, GIF or BMP format.
        </p>
        <div id="obj-file-upload-form">
          <input id="obj-file-upload-input" type="file" name="files[]" multiple="" class="hide">
          <input type="submit" value="Upload or Drop Files Here" id="file-upload-button"/>
        </div>
        <div id="obj-option">
          <h5>obj2gltf options</h5>
        </div>
      </div>
    </li> -->
  </ul>
</div>
