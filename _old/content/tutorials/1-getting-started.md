---
title:  "Getting Started"
date: 2018-03-01
description: "In this tutorial we'll go over everything you need to know to get a very simple three.js app running in your browser."
tags: ['three.js', 'setup', 'codepen', 'scene', 'camera', 'renderer', 'webgl', 'browser console', 'HTML', 'basics', 'canvas', 'perspective camera', 'fov', 'aspect ratio', 'mesh', 'material', 'buffergeometry', 'color', 'lights']
menu: tutorials
menuTitle: Three.js tutorials
menuNumber: "1"
weight: 2
readTime: true
---
Strap in folks, it's time to push some pixels!

Let's get our first three.js scene up and running. When we are finished with chapters 1 and 2, we'll have this glorious beast shining and rotating before our eyes:

{{< codepen "GmJPrm" >}}

### Follow along on Codepen

We'll be using Codepen throughout these tutorials, and you can either follow along there or create local files on your computer.

Click "edit on Codepen" above to open the example in a new window and see how it works. Take a few minutes now to familiarise yourself with the UI.

Next, open [this pen](https://codepen.io/looeee/pen/QaNyjy), which is identical but with all the JavaScript removed. You can use it to follow along with the rest of the tutorial.

Each chapter after this one will start where we left off in the previous chapter, so you can use this pen to follow all the way through, or open the pen linked at the start of each chapter work from there.

### The browser console

Make sure that you are familiar with the browser console. Press `CTRL + SHIFT + I` (`CMD + SHIFT + I` on Mac) now with the codepen window highlighted and a new window will pop up. This is the browser's Development Console. There will be a few differences depending on which browser you are using, but all the important things will be there.

Make sure you have the "console" tab highlighted and type `THREE` (all capital letters), then press return. If three.js loaded correctly, you will see:

{{< highlight js >}}
Object { WebGLRenderTargetCube: WebGLRenderTargetCube(), WebGLRenderTarget: WebGLRenderTarget(), WebGLRenderer: WebGLRenderer(), ShaderLib: Object, UniformsLib: Object, UniformsUtils: Object, ShaderChunk: Object, FogExp2: FogExp2(), Fog: Fog(), Scene: Scene(), 367 more… }
{{< /highlight >}}

telling us that the `THREE` global variable has loaded and can be used.

If three.js has _not_ loaded correctly, we will see something like:

{{< highlight js >}}
Uncaught ReferenceError: THREE is not defined
    at <anonymous>:1:1
{{< /highlight >}}

`Uncaught ReferenceError: SomeObject is not defined` is a very common error and means that you have not included a script correctly, or it has not loaded for some reason.

Codepen also has a built in console, so you can use that if you prefer.

### The basic components of a three.js app

Every three.js app (in fact, nearly every realtime 3D app) will have the following basic components - a `renderer`, a `canvas`, a `scene` and a `camera`. We'll go over each of these in turn and add them to our app.

Turn your attention the `JS` pane in Codepen. It should currently be empty. If its not then delete everything for now. Leave the CSS and HTML panes are they are

If you are writing an HTML file, open an empty `<script>` tag anywhere after the main three.js file was loaded, and put your code in there instead. From here on I'll be assuming that you are following in Codepen, but everything will be basically the same either way.

#### The renderer

We'll start by creating a renderer and setting it to the same width and height as the browser window (or the Codepen preview pane in this case). Add the following code to the JS pane in Codepen:

{{< highlight js >}}
// create a WebGLRenderer and set its width and height
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
{{< /highlight >}}

Take a quick look at the [WebGLRenderer](https://threejs.org/docs/#api/renderers/WebGLRenderer) docs page to familiarise yourself with some of the settings now. Don't worry if you don't understand, all of the settings have default values that you won't need to change for now (or perhaps ever).

We've set the renderer's size to the window's width and height _as it is now_. If we resize the browser window, the window's width and height will change, but the renderer's will not. We'll fix this in Chapter 3.

#### The canvas

The renderer has kindly created a [canvas](https://www.w3schools.com/html/html5_canvas.asp) element to hold our scene. We could do this manually, which would give us more control over the size and position of the canvas, but since we want this app to be fullscreen the default one will do just fine. We need to add it to the page though, so let's do that now:

{{< highlight js >}}
...
renderer.setSize( window.innerWidth, window.innerHeight );

// add the automatically created canvas element to the page
document.body.appendChild( renderer.domElement );
{{< /highlight >}}

(By the way, whenever I ask you to add a line of code I'll also include the line directly above it so you'll know where to put it.)

This appends (i.e. adds just before the closing `</body>` tag) the following to your page, assuming a browser window of 1080 x 600 pixels:

{{< highlight html >}}
<canvas width="1080" height="600" style="width: 1080px; height: 600px;"></canvas>
{{< /highlight >}}

Go ahead and right click on the preview pane in Codepen and select inspect. You should see this:

{{< figure src="/images/tutorials/Ch 1/console_canvas.png" caption="Fig 1: The canvas element that we just added to the page" alt="console with canvas highlighted" lightbox=true class="figure-medium">}}

If you are following along using a file on your own computer, that's basically all you'll see. On codepen there will be a whole lot of junk and above and below it. That's because codepen is creating your app as an `iframe` - that is, a webpage within a webpage. You can read up about iframes [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe) if you like, but it's not important for this tutorial.

#### The scene

There's not much to say about the setup of the Scene as the constructor doesn't take any arguments. Add the following line to your app:

{{< highlight js >}}
...
document.body.appendChild( renderer.domElement );

// create a Scene
const scene = new THREE.Scene();
{{< /highlight >}}

Technically, the scene object is a [Scene Graph](https://en.wikipedia.org/wiki/Scene_graph). You can figure out the technicalities of how that works later, for now just think of the `scene` object as a holder for all the other objects you want to display. Once we have we created an object, if we want to see it we'll need to add it to the scene using `scene.add( object )` and if we later want to remove it from the scene, we can just do `scene.remove( object )`. Simple!

#### The camera

The final object required to render a scene is the camera. Again, there are several types of camera available, but we'll generally stick with the [PerspectiveCamera](https://threejs.org/docs/#api/cameras/PerspectiveCamera) which uses [perspective projection](https://en.wikipedia.org/wiki/3D_projection#Perspective_projection) to set up a view of the scene (_fair warning: that last link is pretty heavy on the mathematics_).

Without going into any great detail here, this renders the scene in the way you expect a 3D scene to look - in other words, it mimics the way the human eye perceives depth, with objects getting smaller the further away they are from the camera. Nearly all 3D games and special effects in films use a perspective camera.

The `PerspectiveCamera` takes four options, which together define its [viewing frustum](https://en.wikipedia.org/wiki/Viewing_frustum):

{{< figure src="/images/tutorials/Ch 1/ViewingFrustum.jpg" caption="Fig 2: The PerspectiveCamera's viewing frustum " alt="Viewing Frustum" class="figure-small" link="https://en.wikipedia.org/wiki/Viewing_frustum#/media/File:ViewFrustum.svg" linkText="(thanks Wikipedia!)" >}}

A `frustum` is a mathematical term describing a four sided rectangular pyramid with the top cut off. When we view the scene with our camera, everything inside the frustum is visible, everything outside it is not.

Here's the code needed to create the camera:

{{< highlight js >}}
...
const scene = new THREE.Scene();

// The four options needed to create a perspective camera
const fov = 35; // fov = Field Of View
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1; // the near clipping plane
const far = 1000; // the far clipping plane

const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );

// every object is initially created at ( 0, 0, 0 )
// we'll move the camera back a bit so that we can view the scene
camera.position.set( 0, 0, 40 );
{{< /highlight >}}

Let's take a quick look at the options we passed to the camera.

* `fov` or Field of View: Along with `aspect` this is straight out of a photography manual. This is the angle of the viewing frustum, that is, how much of the world can be seen through the camera. It's specified in degrees. As a human with eyes on the front of your head, you have a smaller FOV than an antelope with eyes on the side of its head - in fact, a human's FOV is about 120 degrees, so for a realistic FOV in your app, you will need to consider how much of this field of vision the screen will be likely to take up. Console games designed to be shown on screens far away from the viewer are usually between 40 - 60 degrees, while a PC game might use a higher FOV of around 90 since the screen is likely to be right in front of the player.

* `aspect` ratio: this is pretty simple - it's the width divided by the height of the viewing rectangle. So an aspect ratio of 1 will be a square, while `window.innerWidth / window.innerHeight` will be a rectangle with the same proportions as your browser window. The thing to keep in mind here is that this needs to match the actual canvas and renderer size - so if we update these (for example if the browser window changes size), then this needs to be updated too.

* `near`: Objects closer than the `near` will not be visible (technically, they will not be `rendered`).

* `far`: Similarly, objects further away from the camera than this will not be visible.

Note that for a Perspective camera, the near plane must be greater than 0. The far plane, technically, can be anything that is bigger than the near plane and less than infinity.

In practice you want the area contained within the viewing frustum to be as small as possible. So you'll set near as big as possible and far as small as possible. For now the values which we set above will be fine though.

#### Positioning an object in 3D space

Since this is the first time that we've had to take the position of an object into account, let's examine what we did with the line `camera.position.set( 0, 0, 40 )`.

Here's what the coordinate system in three.js looks like:

{{< figure src="/images/tutorials/Ch 1/coords.jpg" caption="Fig 3: The three.js coordinate system" alt="Coordinate system" class="figure-small" >}}

 * +X points to the right of the screen
 * -X points to the left of the screen
 * +Y points to the top of the screen
 * -Y points to the bottom of the screen
 * +Z points _out_ of the screen (towards you)
 * -Z points _into_ the screen (away from you)

The direction of the Z axis is the most important thing to take note of here.
`camera.position.set( 0, 0, 40 )` is equivalent to:

{{< highlight js >}}
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 40;
{{< /highlight >}}

That is, we've left the camera in the middle of the screen, but moved it 40 units _towards_ us.

Note also that by convention, one unit on three.js is one meter. Since we set our `camera.far` value to 1000, we now have a scene sized at a scale of about 1 kilometre. This is bigger than we need, but it's an OK size for a scene. Avoid making very big scenes or very tiny scenes and you will be fine. The only time that this will be a problem is if you decide to make a physically accurate space simulation.

### Adding a visible object to our scene

Visible objects in three.js consist of three components - a [Geometry](https://threejs.org/docs/#Reference/Core/Geometry) (or rather a [BufferGeometry](https://threejs.org/docs/#Reference/Core/BufferGeometry), but more on that below), a `Material`, and a `Mesh` which combines the geometry and material and is used to set the position of the object inside the scene.

#### Creating a geometry

We'll start by creating a [TorusKnotBufferGeometry](https://threejs.org/docs/#Reference/Geometries/TorusKnotBufferGeometry). Add the following line after the camera:

{{< highlight js >}}
...
camera.position.set( 0, 0, 40 );

// create a geometry
const geometry = new THREE.TorusKnotBufferGeometry( 5, 1 );
{{< /highlight >}}

The two parameters that we passed in define the radius (overall size), and radius of the tube, respectively. Most options in three.js have built-in defaults, so even though the docs say that this should take _6_ parameters, we can get away with ignoring most or all of them and sensible defaults will be chosen.

##### BufferGeometry?

Wait, why did we just create a [TorusKnotBufferGeometry](https://threejs.org/docs/#Reference/Geometries/TorusKnotBufferGeometry) instead of just a [TorusKnotGeometry](https://threejs.org/docs/#Reference/Geometries/TorusKnotGeometry)?

Well, that's a bit beyond the scope of these tutorials, so for now we'll just say that [BufferGeometry](https://threejs.org/docs/#api/core/BufferGeometry) is a newer and faster (although a little harder to work) version of [Geometry](https://threejs.org/docs/#api/core/Geometry), and you should always use a BufferGeometry rather than a Geometry. In fact, it's likely that at some point the ability to render Geometry will be removed entirely. For the time being though it's still there to maintain backwards compatibility.

#### Creating a material

To start with, we'll create a [MeshBasicMaterial](https://threejs.org/docs/#Reference/Materials/MeshBasicMaterial) which is the simplest (and fastest) material available in three.js. It completely ignores any lights in the scene and just shades a mesh based on its color or any texture maps, which is useful here since we have not yet added any lights.

In fact, if we used most of the other material types right now we wouldn't be able to see anything at all since the scene is in total darkness. Just as in the real world, we (usually) need light to see things in our scene. `MeshBasicMaterial` is an exception.

This is a common point of confusion when you are just getting started, so if you can't see anything make sure you have added some lights to your scene and they are shining on the object that you expect to see, or temporarily switch to a `MeshBasicMaterial`.

Add the following line to your code to create the material:

{{< highlight js >}}
...
const geometry = new THREE.TorusKnotBufferGeometry( 5, 1 );

// create a default (white) MeshBasicMaterial
const material = new THREE.MeshBasicMaterial();
{{< /highlight >}}

Remember what I said about three.js assigning sensible default values if you don't provide them yourself? Well, in this case, it the material will be white since we have not _passed in_ any color parameter. We'll see how to change the material's color in the next chapter.

#### Creating a mesh and adding it to the scene

Next, we'll combine the geometry and material into a [Mesh](https://threejs.org/docs/#api/objects/Mesh) and add it to the scene. The `mesh` object is one of the most important and basic objects in three.js and you will be using it a lot. Thankfully, just like the `scene` object, it's fairly simple and its most important function is to serve as a holder for a `geometry` and `material` and tell us where in the scene they are located.

{{< highlight js >}}
...
const material = new THREE.MeshBasicMaterial();

// create a Mesh containing the geometry and material
const mesh = new THREE.Mesh( geometry, material );

// add the mesh to the scene object
scene.add( mesh );
{{< /highlight >}}

### Rendering the scene

Finally, we are ready to push some glorious, hand-crafted pixels into our eyeballs!

Add the following and final line to your code:

{{< highlight js >}}
...
scene.add( mesh );

renderer.render( scene, camera );
{{< /highlight >}}

This tells the renderer to `render` ( that is, create a still image ) of the portion of the  scene contained within the camera viewing frustum.

After adding the previous line, you will now see this:

{{< codepen "qpNvdd" >}}

It's very basic so far. Without lighting illuminate the contours of the object, it's not possible to even know that it's 3D, and without movement or color it looks a bit dull.
But still, it's quite impressive that we were able to do this so fast.

We'll quickly fix all of these problems in the next chapter, as well as take a look at how best to organise our code to keep track of everything as our app grows.