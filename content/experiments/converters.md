---
title: "Convert various file formats to GLTF"
date: 2017-05-12T00:00:00-00:00
description: "GLTF is the up and coming superstar of 3D model formats - you can even display it on the Facebook news feed."
tags: ['gltf', 'three.js', 'obj2gltf', 'converter']
# teaserImage: /images/experiments/converters/teaser.jpg
js: converters
menu: experiments
menuTitle: Blackthread Experiments
weight: 3
vendorScripts:
  [
  "/inflate.min",
  "/three/build/three.min",
  '/three/examples/js/loaders/DDSLoader',
  '/three/examples/js/loaders/FBXLoader',
  '/three/examples/js/loaders/GLTFLoader',
  '/three/examples/js/loaders/LoaderSupport',
  '/three/examples/js/loaders/OBJLoader',
  '/three/examples/js/loaders/MTLLoader',
  '/three/examples/js/loaders/ColladaLoader',
  # '/three/examples/js/controls/OrbitControls',
  '/three/examples/js/exporters/GLTFExporter'
   ]
draft: true
---
<p>
 GLTF is the up and coming superstar of 3D model formats - you can even display it on the Facebook news feed! Below are a couple of options for converting files in other formats to GLTF format.
</p><br>
<div id="threejs2gltf" class="border-section">
  <h2>The three.js exporter</h2>
  <p>
    Convert from a variety of formats to GLTF format using the three.js <a href="https://threejs.org/examples/#misc_exporter_gltf">GLTFExporter</a>. Currently this supports FBX, OBJ, GLTF and GLB  (because why not?) and Collada ( DAE ).
    Upload textures in JPG, PNG, GIF, BMP or DDS format.
  </p><br>
  <div id="obj-file-upload-form">
    <input id="obj-file-upload-input" type="file" name="files[]" multiple="" class="hide">
    <input type="submit" value="Upload or Drop Files Here" id="file-upload-button"/>
  </div>
  <div id="threejs-option"></div>
<div id="obj2gltf" class="border-section">
  <h2>obj2gltf</h2>
  <p>
    Convert from OBJ to GLTF format. The homepage for this tool is <a href="https://github.com/AnalyticalGraphicsInc/obj2gltf">here</a>.
    You can upload an OBJ file, its associated MTL file, and any textures in JPG, PNG, GIF or BMP format.
  </p><br>
  <div id="obj-file-upload-form">
    <input id="obj-file-upload-input" type="file" name="files[]" multiple="" class="hide">
    <input type="submit" value="Upload or Drop Files Here" id="file-upload-button"/>
  </div>
  <div id="obj-option"></div>
</div>
</div>
