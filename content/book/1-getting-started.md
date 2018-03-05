---
title:  "Getting Started"
date: 2018-01-05T00:00:00-00:00
description: "In this tutorial we'll go over everything you need to know to get a simple three.js app running in your browser"
tags: ['three.js', 'setup', 'codepen', 'scene', 'camera', 'renderer', 'webgl', 'browser console', 'HTML', 'basics', 'canvas', 'perspective camera', 'fov', 'aspect ratio', 'mesh', 'material', 'buffergeometry', 'color', 'lights']
menu: book
menuTitle: Three.js book first draft
menuNumber: "1"
weight: 7
readTime: true
draft: true
---

Strap in folks, it's time to push some pixels!

Let's get our first three.js scene up and running. When we are finished with chapters 1 and 2, we'll have this glorious beast shining and rotating before us:

{{< codepen "GmJPrm" >}}

#### Follow along on Codepen

I mentioned a few times in the introductory chapters that we'll be using Codepen throughout these tutorials, and that you can either follow along there or create local files on your computer, but since I assume that lots of people are like me and skip introductory chapters, I should probably mention it again. Which I just did.

Click "edit on Codepen" above to open the example in a new window and see how it works. Take a few minutes now to familiarise yourself with the UI.

Next, open [this pen](https://codepen.io/looeee/pen/QaNyjy), which is identical but with all the JavaScript removed. You can use it to follow along with the rest of the tutorial.

#### Initial HTML file setup

For those of you who are not using Codepen, review the last section of [0.0 Requirements](/tutorials/0-0-requirements/#working-locally) for instructions on setting up a basic HTML file that you can use. From here on I'll be assuming that you are using Codepen, _unless_ there is an important difference. Most things will be the same though, so whichever way you choose is fine.

#### The browser console

I've mentioned this a few times so far, but make sure that you are familiar with the browser console. Press `CTRL + SHIFT + I` now with the codepen window highlighted and a new window will pop up. This is the browser's Development Console. There will be a few differences depending on which browsers you are using, but all the important things will be there.

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

Be warned that the console is a bit tricky when using Codepen - you need to highlight the preview pane before opening the console to get it to work correctly, otherwise, it will reference the main page and tell us that the file has not loaded correctly even when it has. The easiest way to do this is right click in the preview plane and click "inspect" to open the console, or use the built-in console (the button is in the bottom right of the Codepen page).

### The basic components of a three.js app

Every three.js app (in fact, nearly every 3D app of any kind) will have the following basic components - a `renderer`, a `canvas`, a `scene` and a `camera`. For now, we'll just add these to our page with minimal explanation. We'll come back to them later to add detail.

Turn your attention the `JS` pane in Codepen. It should currently be empty. Let's fix that.

If you are writing an HTML file, open an empty `<script>` tag anywhere after the main three.js file was loaded, and put your code in there instead.

#### The renderer

We'll start by creating a renderer and setting it to the same width and height as the browser window (or the Codepen preview pane in this case). Add the following code to the JS pane in Codepen:

{{< highlight js >}}
// create a WebGLRenderer and set its width and height
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
{{< /highlight >}}

Take a quick look at the [WebGLRenderer](https://threejs.org/docs/#api/renderers/WebGLRenderer) docs page to familiarise yourself with some of the settings now. We'll cover them in detail later.


We've set the renderers size to the window's width and height _as it is now_. If we resize the browser window, the window's width and height will change, but the renderer's will not. Don't worry, we'll come back to fix this later.

There are other renderers available - the files are contained in the [/examples/js/renderers/](https://github.com/mrdoob/three.js/tree/master/examples/js/renderers) directory on Github, and will have to be loaded separately to the main `three.js` file if you wish to use them. We won't be covering them at all in these tutorials since they were created in the days when WebGL was poorly supported and are generally slower and harder to work with than the WebGLRenderer.

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

#### The scene

There's not much to say about the setup of the Scene as the constructor doesn't take any arguments. Add the following line:

{{< highlight js >}}
...
document.body.appendChild( renderer.domElement );

// create a Scene
const scene = new THREE.Scene();
{{< /highlight >}}

We will have more to say about how the actual scene object (technically a [Scene Graph](https://en.wikipedia.org/wiki/Scene_graph) ) works later. For now, just think of the `scene` object as a holder for all the other objects you want to display. Once we have we created an object, if we want to see it we'll need to add it to the scene using `scene.add( object )` and if we later want to remove it from the scene, we can just do `scene.remove( object )`. Simple!

#### The camera

The final object required to render a scene is the camera. Again, there are several types of camera available, but we'll generally stick with the [PerspectiveCamera](https://threejs.org/docs/#api/cameras/PerspectiveCamera) which uses `perspective projection` set up a view of the scene. Without going into any great detail here, this renders the scene the way you expect a 3D scene to look - in other words, it mimics the way the human eye perceives depth, with objects getting smaller the further away they are from the camera.

The PerspectiveCamera takes four options, which together define its [viewing frustum](https://en.wikipedia.org/wiki/Viewing_frustum):

{{< figure src="/images/tutorials/ViewingFrustum.jpg" caption="Fig 1: The PerspectiveCamera's viewing frustum" alt="Viewing Frustum" class="figure-small" >}}

A `frustum` is a mathematical term describing a four rectangular pyramid with the top cut off. Everything inside the frustum is visible, everything outside it is not.

Here's the code needed to create the camera:

{{< highlight js >}}
...
const scene = new THREE.Scene();

// set up the options for a perspective camera
const fov = 35; // fov = Field Of View
const aspect = window.innerWidth / window.innerHeight;
const nearClippingPlane = 0.1;
const farClippingPlane = 1000;

const camera = new THREE.PerspectiveCamera( fov, aspect, nearClippingPlane, farClippingPlane );

// every object is initially created at ( 0, 0, 0 )
// we'll move the camera back a bit so that we can view the scene
camera.position.set( 0, 0, 40 );
{{< /highlight >}}

Let's take a quick look at the options we passed to the camera.

* `fov` or Field of View: Along with `aspect` this is straight out of a photography manual. This the angle of the viewing frustum, that is, how much of the world can be seen through the camera. As a human with eyes on the front of your head, you have a smaller FOV than an antelope with eyes on the side of its head - in fact, a human's FOV is about 120 degrees, so for a realistic FOV in your app, you will need to consider how much of this field of vision the screen will be likely to take up. Console games designed to be shown on screens far away from the viewer are usually between 40 - 60 degrees, while a PC game might use a higher FOV of around 90 since the screen is likely to be right in front of the player.

* `aspect` ratio: this is pretty simple - it's the width divided by the height of the viewing rectangle. So an aspect ratio of 1 will be a square, while `window.innerWidth / window.innerHeight` will be a rectangle with the same proportions as your browser window. The thing to keep in mind here is that this needs to match the actual canvas and renderer size - so if we update these (for example if the browser window changes size), then this needs to be updated too.

* `nearClippingPlane`: Objects closer than the `nearClippingPlane` will not be visible (technically, they will not be `rendered`).

* `farClippingPlane`: Similarly, objects further away from the camera than this will not be visible. There are other important factors that we need to consider when choosing the near and far clipping planes, but we'll go over those in a later chapter since they are quite technical. For now, you can safely use the values above in most apps.

### Adding a visible object to our scene

Most visible objects in three.js consists of three components - a [Geometry](https://threejs.org/docs/#Reference/Core/Geometry) (or preferably a [BufferGeometry](https://threejs.org/docs/#Reference/Core/BufferGeometry), but more on that later), a `Material` and a `Mesh` which combines the geometry and material and is used to set the position of the object inside the scene.

#### Creating a geometry

We'll start by creating a [TorusKnotBufferGeometry](https://threejs.org/docs/#Reference/Geometries/TorusKnotBufferGeometry).

The two options we passed to it defined the radius (overall size), and radius of the tube, respectively. Most options in three.js have built-in defaults, so even though the docs say that this should take 6 _arguments_ (AKA _parameters_ ), we can get away with ignoring most or all of them and sensible defaults will be chosen.

{{< highlight js >}}
...
camera.position.set( 0, 0, 40 );

// create a geometry
const geometry = new THREE.TorusKnotBufferGeometry( 5, 1 );
{{< /highlight >}}

##### BufferGeometry?

Wait, why did we just create a [TorusKnotBufferGeometry](https://threejs.org/docs/#Reference/Geometries/TorusKnotBufferGeometry) instead of just a [TorusKnotGeometry](https://threejs.org/docs/#Reference/Geometries/TorusKnotGeometry)?

Well, we'll be devoting an entire chapter to this topic, very soon. But for now suffice to say that [BufferGeometry](https://threejs.org/docs/#api/core/BufferGeometry) is a newer and faster (although slightly more complex) version of [Geometry](https://threejs.org/docs/#api/core/Geometry), and you should be preferring BufferGeometry in almost every conceivable case.

#### Creating a material

We'll go over materials in much more detail in future, but here we'll just create a  [MeshBasicMaterial](https://threejs.org/docs/#Reference/Materials/MeshBasicMaterial) which is the simplest (and fastest) material available in three.js. It completely ignores any lights in the scene and just shades a mesh based on its colour or any texture maps, which is useful here since we have not yet added any lights.


Be aware that if we used other materials which *do* use lights, we would not see anything at all as our scene is completely dark! This is a common point of confusion when you are just getting started, so if you can't see anything make sure you have added some lights to your scene and they are pointing at the object you want to see.
Otherwise, just as if you were staring at a black dog on a dark night, you will not see anything at all.

Enough of that, let's create the material:

{{< highlight js >}}
...
const geometry = new THREE.TorusKnotBufferGeometry( 5, 1 );

// create a default (white) MeshBasicMaterial
const material = new THREE.MeshBasicMaterial();
{{< /highlight >}}

Remember what I said about three.js assigning sensible default values if you don't provide them yourself? Well, in this case, it the material will be white since we have not _passed in_ any colour parameter. I would have gone for purple myself. Oh well...

#### Creating a mesh and adding it to the scene

Next, we'll combine the geometry and material into a [Mesh](https://threejs.org/docs/#api/objects/Mesh) and add it to the scene. The `mesh` object is one of the most important and basic objects in three.js and you will be using it a lot. Thankfully, like the `scene` object, it's fairly simple and it's most important function is to serve as a holder for a `geometry` and `material` and tell us where in the scene they are located.

{{< highlight js >}}
...
const material = new THREE.MeshBasicMaterial();

// create a Mesh containing the geometry and material
const mesh = new THREE.Mesh( geometry, material );

// add the mesh to the scene object
scene.add( mesh );
{{< /highlight >}}

### Rendering the scene

Finally, we are ready to push those glorious pixels into our eyeballs!

Add the following and final line to your code:

{{< highlight js >}}
...
scene.add( mesh );

renderer.render( scene, camera );
{{< /highlight >}}s

This tells the renderer to `render` ( that is, create a still image ) of the entire `scene` and all the objects it contains from the point of view of the `camera`.

With even this simple setup we can do all kinds of fancy things like quickly switch between multiple cameras, or multiple scenes, within the same app, or even render one camera view or scene on top of another for some interesting effects.

After adding the previous line, we will now see this:

{{< codepen "qpNvdd" >}}

What's that you say? It looks like an especially boring Celtic Knot? Ungrateful clods! OK, fine, on to the next chapter and we'll see what we can do to make things a bit more interesting.