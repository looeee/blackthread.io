---
title:  "Shapes and Transformations"
date: 2018-01-12T00:00:00-00:00
description: "Taking a quick look at the built in geometries and how to position them in 3D space within our scene"
tags: ['three.js', 'requirements', 'WebGL', 'Codepen', 'browser console', 'HTML']
menu: tutorials
menuTitle: Three.js tutorials
menuNumber: "1.5"
weight: 10
readTime: true
---

In this chapter, we'll take a lighting quick look at some of the geometric shapes that are built into three.js. We've already seen two of them, the Torus Knot from chapters 1.1 and 1.2, and the Box from Chapter 1.3.

We'll also take a look at how to move them around (`translate` them), `scale` them up and down and `rotate` them. Collectively, along with the less common `shear`, these are known as transformations (technically, they are _linear_ or _affine_ transformations).

We'll introduce a new word now, just so that you are not too surprised when you come across it later. And that word is... (drumroll):

{:.notice}
Quaternion

These things are seriously cool. They are a different way to rotate objects, rather than the standard rotation around the `x`, `y` and `z` axes, and have several benefits. We'll go over them in detail later, for now just take a note of the word and remember that these are not really any more complicated than normal rotations, they just take a little while to get used to.

Here's where we left off last time.

<p data-height="400" data-theme-id="0" data-slug-hash="eydKyM" data-default-tab="result" class='codepen'></p>
<script async="async" src="//codepen.io/assets/embed/ei.js"></script>

### Setting up the scene

Start by moving the camera back a bit so that we can see more of the scene:

{{< highlight js >}}
  camera.position.set( 0, 0, 150 );
{{< /highlight >}}

Also, remove the texture loader lines and change the material back to

{{< highlight js >}}
  // create a material
  const material = new THREE.MeshStandardMaterial( { color: 0xffffff} );
{{< /highlight >}}

We now have a plain white cube against a black background. Poetic? Boring? Your choice.

### The built-in geometries

All the built-in geometries (20 in total as of R89) are listed in the docs and come in two flavours, `Geometry`, and `BufferGeometry`. We will cover the difference between the two soon, but for now just remember this rule:

{:.notice}
Always use BufferGeometry

The Geometry types are older and less efficient. They are kept around to prevent old applications and tutorials from breaking too badly. BufferGeometry is newer, cooler, faster and smell better, at the expense of being just a little bit harder to work with.

These geometries range from the mundane:

* [BoxBufferGeometry](https://threejs.org/docs/#api/geometries/BoxBufferGeometry)
* [PlaneBufferGeometry](https://threejs.org/docs/#api/geometries/PlaneBufferGeometry)
* [SphereBufferGeometry](https://threejs.org/docs/#api/geometries/ShapeBufferGeometry)

To the exotic:

* [DodecahedronBufferGeometry](https://threejs.org/docs/#api/geometries/DodecahedronBufferGeometry)
* [ParametricBufferGeometry](https://threejs.org/docs/#api/geometries/ParametricBufferGeometry)
* [TorusKnotBufferGeometry](https://threejs.org/docs/#api/geometries/TorusKnotBufferGeometry)

To the specialised:

* [ExtrudeBufferGeometry](https://threejs.org/docs/#api/geometries/ExtrudeBufferGeometry)
* [ShapeBufferGeometry](https://threejs.org/docs/#api/geometries/ShapeBufferGeometry)
* [TextBufferGeometry](https://threejs.org/docs/#api/geometries/TextBufferGeometry)

### Move geometry creation to a separate function

Let's move our mesh creation out of the `init` function and into a separate function called `initMeshes` to keep things clean. We'll also give the current material, geometry and mesh less generic names since we will soon have more than one of each. Once we have done so, our complete code will look like this:

{{< highlight js >}}
// these need to be accessed inside more than one function so we'll declare them first
let camera, renderer, scene;

function init() {

  // create a WebGLRenderer and set its width and height
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );

  // add the automatically created canvas element to the page
  document.body.appendChild( renderer.domElement );

  // create a Scene
  scene = new THREE.Scene();

  // set up the options for a perspective camera
  const fov = 35; // fov = Field Of View
  const aspect = window.innerWidth / window.innerHeight;
  const nearClippingPlane = 0.1;
  const farClippingPlane = 1000;

  camera = new THREE.PerspectiveCamera( fov, aspect, nearClippingPlane, farClippingPlane );

  // every object is initially created at ( 0, 0, 0 )
  // we'll move the camera back a bit so that we can view the scene
  camera.position.set( 0, 0, 150 );

  const controls = new THREE.OrbitControls( camera );

  // create a global illumination light
  const ambientLight = new THREE.AmbientLight( 0xffffff, 1.0 );

  // remember to add the light to the scene
  scene.add( ambientLight );

  // Create an omnidirectional point light
  const pointLight = new THREE.PointLight( 0xffffff, 2.0 );

  pointLight.position.set( 0, 0, 20 );

  scene.add( pointLight );

}

function initMeshes() {

  const boxGeometry = new THREE.BoxBufferGeometry( 15, 15, 15 );
  const boxMaterial = new THREE.MeshStandardMaterial( { color: 0xffffff } );
  const boxMesh = new THREE.Mesh( boxGeometry, boxMaterial );

  scene.add( boxMesh );

}

function animate() {

  // call animate recursively
  requestAnimationFrame( animate );

  renderer.render( scene, camera );

}

function onWindowResize() {

  // set the aspect ratio to match the new browser window aspect ratio
  camera.aspect = window.innerWidth / window.innerHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  // update the size of the renderer AND the canvas
  renderer.setSize( window.innerWidth, window.innerHeight );

}

window.addEventListener( 'resize', onWindowResize );

// call the init function to set everything up
init();

// call the initMeshes function to create meshes and add them to the scene
initMeshes();

// then call the animate function to render the scene
animate();

{{< /highlight >}}

Note that we've also removed the `mesh` variable from the very top line since we no longer need to access it outside the initMesh function.

### Adding a second mesh

Let's add a flat geometry this time - a [RingBufferGeometry](https://threejs.org/docs/#api/geometries/RingBufferGeometry).

Add the following lines, inside the `initMesh` function and after we have created the box:

{{< highlight js >}}
...
  scene.add( boxMesh );

  const ringGeometry = new THREE.RingBufferGeometry( 20, 15, 32 );
  const ringMaterials = new THREE.MeshStandardMaterial( { color: 0xff0000, side: THREE.DoubleSide } ); // red color
  const ringMesh = new THREE.Mesh( ringGeometry, ringMaterials );

  scene.add( ringMesh );
...
{{< /highlight >}}

We are adding the `boxMesh` and `ringMesh` to the scene separately. We could also do this in one line:

{{< highlight js >}}
  scene.add( boxMesh, ringMesh );
{{< /highlight >}}

I prefer to keep this separate so that I can quickly comment out a line if I want to remove an object. It's up to you though.

We are passing three arguments to the `RingBufferGeometry`: the outer radius (20), the inner radius (15), and the theta segments (32) which was a name given to the parameter that controls the "fineness" of the mesh and therefore the "roundness" of the ring. Try playing around with this number, and also check the docs page for any other parameter there might be.

#### Setting the `material.side` parameter

The final thing that we've done here is add a second parameter to the material: `material.side`. And we've set it to `THREE.DoubleSide`. This is a _constant_ - there are quite a few constants used in three.js, and they are used for settings on all kinds of things - materials, the renderer, textures and so on.

For the material's side, there are three constants available: `THREE.FrontSide` (the default), `THREE.BackSide`, and `THREE.DoubleSide`, which we are using here. Try setting the value of side for the ring to each of these in turn and see what happens.

{:.paragraph-notice}
The reason we need to set this here is that the ring is _flat_ - that is, it's made up of just a single plane of polygons, and polygons by default can only be seen from one side, which makes rendering them faster. For most 3D objects this is fine since you can't see inside them. But if you were to place the camera inside the cube right now, it would be invisible unless you set it's `material.side` to `THREE.BackSide` or `THREE.DoubleSide`.

Hmm... this scene is reminding me of being on the London Underground a bit too much, time to add some more shapes!

### Adding more meshes and moving them around

Up to now, we've been creating objects by making one geometry, one material and one mesh for each. But what if we want to create several shiny spheres? Our current approach seems kind of inefficient, and as we'll see, we can reuse geometries and materials in multiple meshes.

Create a new geometry and a new material under the ring. I'm going to use an [OctahedronBufferGeometry](https://threejs.org/docs/#api/geometries/OctahedronBufferGeometry), and a blue material:

{{< highlight js >}}
...
  scene.add( ringMesh );

  const octaGeometry = new THREE.OctahedronBufferGeometry( 4 );

  const octaMaterial = new THREE.MeshStandardMaterial( { color: 0x0000ff } );
...
{{< /highlight >}}

No need to set the `material.side` parameter here, the default of `THREE.FrontSide` is fine. We'll also take the time to understand how colours work soon - like, just why is `0x0000ff` blue?

We're passing in a single parameter here, the radius of the octahedron (2). Again, this geometry can take other parameters, and you can explore them in the live example on the docs page.

Next, we'll create our first mesh from the `octaGeometry` and `octaMaterial`:

{{< highlight js >}}
...
  const octaMaterial = new THREE.MeshStandardMaterial( { color: 0x0000ff } );

  const octaMesh1 = new THREE.Mesh( octaGeometry, octaMaterial );

  scene.add( octaMesh1 );
...
{{< /highlight >}}

The problem is, we can't see this. It's been created, as all objects are, at the `( 0, 0, 0 )` (the _origin_), and since our cube is already there and is bigger, our poor octahedron is _inside_ the cube, completely hidden. Try zooming the camera slowly in until it is inside the cube, and the octahedron will magically appear.

We need to move our octahedron into its own region of space since it turns out that octahedrons have a bit of an issue with personal space and don't like being put inside cubes against there will. Who knew?

First, let's quickly introduce the three.js coordinate system so that we can see where we standard.

#### The three.js coordinate system

{{< figure src="/images/tutorials/coords.jpg" caption="Fig 1: The three.js coordinate system" alt="three.js coordinate system" class="figure-small" >}}

##### The x-axis

The negative x-axis stretches to the left of our screen, and the positive x stretches to the right, which so far is as you would expect

##### The y-axis

The positive y-axis stretches towards the top of your screen, and the negative y-axis goes towards the bottom, and here we web developers hit a point of confusion:

{:.paragraph-notice}
The y-axis in three.js is _reversed_ compared to the y-axis in CSS. That is, the top of the screen it would be labelled `+Y` in three.js, but `-Y` in CSS.
This is unfortunate, but three.js had to follow the convention of other 3D applications rather than the convention of web development. The only time it really becomes an issue though is if you are trying to match HTML elements with three.js objects.

##### The z-axis

Positive z points out of the screen towards you, and negative z points into the screen. That's why, to move our camera _backwards_, we set its z position to 60. Intuitively, you might have thought that to move the camera back you would give it a _negative_ z value. Not so. Remember:

* `+Z` -> move out of the screen
* `-Z` -> move into the screen

In our app so far, the camera is positioned on the z-axis, right around where the `+ Z` label is, and the white box is positioned at the origin, where the three axes meet at (0, 0, 0).

#### Our first transformation: Translation

Translation is the simplest type of transformation to understand. You just move an object left or right ( along the x-axis ), up or down ( along the y-axis ), or back or forwards (along the z-axis).

Let's move our poor octahedron out of the box:
{{< highlight js >}}
...
  const octaMesh1 = new THREE.Mesh( octaGeometry, octaMaterial );

  octaMesh1.position.set( -20, 0, 0 ); // move 20 units to the left

  scene.add( octaMesh1 );
...
{{< /highlight >}}

##### Transforming meshes vs transforming geometries

If you have looked through the [BufferGeometry](https://threejs.org/docs/#api/core/BufferGeometry) docs, you might have noticed that there is a [BufferGeometry.translate](https://threejs.org/docs/#api/core/BufferGeometry.translate) method. Why are we translating the mesh instead of translating the geometry directly?

Well, to put it simply, because it is **MUCH** more efficient.
When you transform a geometry, you are applying a transformation to the `vertices` and `normals` that make it up, resulting in possibly thousands or even millions of operations, while if you transform a mesh, then you are just updating its position within the scene which is a very quick operation.

We'll cover what all means in more detail in the chapter on geometry, but for now just remember this rule:

{:.notice}
Apply transformations to meshes, not geometries

#### Adding the final octahedrons

Our scene looks a little unbalanced now. Let's add a couple of octahedrons and position them at the other quadrants of the ring.

Add `octaMesh2` and `octaMesh3` like so:

{{< highlight js >}}
...

  octaMesh1.position.set( -20, 0, 0 ); // move 20 units to the left

  const octaMesh2 = new THREE.Mesh( octaGeometry, octaMaterial );

  octaMesh2.position.set( 20, 0, 0 ); // move 20 units to the right

  const octaMesh3 = new THREE.Mesh( octaGeometry, octaMaterial );

  octaMesh3.position.set( 0, 20, 0 ); // move 20 units up

  scene.add( octaMesh1, octaMesh2, octaMesh3 );
...
{{< /highlight >}}

Notice that they are all using the same geometry and mesh. Efficient!

For our last octahedron, let's shake things up a little and introduce the [Mesh.clone()](https://threejs.org/docs/#api/objects/Mesh.clone) method. Most things in three.js have a clone method which is a quick and efficient way to create multiple copies.

Before we go ahead though, will this also clone the geometry and material, destroying our dreams of efficiency? Let's take a look into the source code - if you scroll down to the very bottom of the [Mesh](https://threejs.org/docs/#api/objects/Mesh) docs page, you'll see it has a link to the source code - go ahead and click that now and find the [`.clone`](https://github.com/mrdoob/three.js/blob/master/src/objects/Mesh.js#L391-L395) method.

It's pretty simple actually, and we can see that it doesn't clone the geometry and material, just copies them in:

{{< highlight js >}}
// MESH.CLONE from three.js src
clone: function () {

  return new this.constructor( this.geometry, this.material ).copy( this );

}
{{< /highlight >}}

The call to `.copy( this )` at the end just copies in any change we have made to the mesh - in particular, if we have moved or rotated or scaled the mesh, then the cloned mesh will be similarly transformed.

Knowing this, we can confidently go ahead and use clone to create our final octahedron:

{{< highlight js >}}
...
  octaMesh3.position.set( 0, 20, 0 ); // move 20 units up

  const octaMesh4 = octaMesh3.clone();

  octaMesh4.position.set( 0, -20, 0 ); // move 20 units down

  scene.add( octaMesh1, octaMesh2, octaMesh3 );
...
{{< /highlight >}}

Great!

#### Transformation number 2: Scale

If you look closely, you'll see that the points of the octahedrons don't quite match the outer edge of the ring. Scale is a useful tool for making minor adjustments like this - it's very common that when you are using models from different modelling programs or different artists, they won't quite match up, and will need to be scaled to fit.

In this case, a little trial and error in scaling the ring matches them up quite nicely:

{{< highlight js >}}
...
  const ringMesh = new THREE.Mesh( ringGeometry, ringMaterials );

   ringMesh.scale.set( 1.02, 1.02, 1.02 );

  scene.add( octaMesh1, octaMesh2, octaMesh3 );
...
{{< /highlight >}}

This scales the `ringMesh` by 1.02 along the x-axis, then the y-axis, then the z-axis. That is, it is now 102% of its original size.

The final transformation we need to cover is rotation. It turns out that rotating things in 3D is a bit trickier than scaling or translating them, even though in most cases you won't run into any problems. But since we need to introduce a bit of theory and a couple of new terms, we'll save this for the next chapter.

For now, here's our lovely new logo, which is _definitely_ not a rip off of the London Underground logo.

<p data-height="400" data-theme-id="0" data-slug-hash="VyKGXx" data-default-tab="result" class='codepen'></p>
<script async="async" src="//codepen.io/assets/embed/ei.js"></script>