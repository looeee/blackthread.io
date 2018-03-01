---
title:  "Introduction to textures"
date: 2018-01-08T00:00:00-00:00
description: "In this tutorial we'll cover how textures work for creating realistic looking materials, and add one to our scene"
tags: ['three.js', 'textures', 'loaders', 'security', 'server', 'textureLoader', 'browser']
menu: tutorials
menuTitle: Three.js tutorials
menuNumber: "4"
weight: 10
readTime: true
---

So far we have just created a simple coloured material for our mesh. If we want to create something more realistic we'll have to move onto using [texture mapping](https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/crate.gif).

Put very simply, this means taking an image and stretching it over the surface of a 3D object. Of course, this will be very easy to do if the surface of the 3D object is square, and less easy of the surface is curved and knotted.

### Setting up the geometry for texture mapping

Start by loading up the code from the previous chapter.

<p data-height="400" data-theme-id="0" data-slug-hash="QaKqzq" data-default-tab="result" class='codepen'></p>
<script async="async" src="//codepen.io/assets/embed/ei.js"></script>

That... looks like a very curved and knotted surface. Let's switch it out for something a bit plainer. Change the line

{{< highlight js >}}
...
  // create a geometry
  const geometry = new THREE.TorusKnotBufferGeometry( 5, 1 );
...
{{< /highlight >}}

{{< highlight js >}}
...
  // create a geometry
  const geometry = new THREE.BoxBufferGeometry( 15, 15, 15 );
...
{{< /highlight >}}

This changes our torus knot to a cube 15 units long, wide and high, ready to have a texture applied to each side.

### Loading a texture with the `TextureLoader`

We'll turn this purple box into a wooden crate. Fortunately, the three.js repo has lots of free textures that we can use as we like, one of which is just what we are looking for:

{{< figure src="https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/crate.gif" alt="Wooden box texture" class="figure-small" >}}

We'll use the [Texture Loader](https://threejs.org/docs/#api/loaders/TextureLoader) to load it. Once it has loaded, the loader returns a [Texture](https://threejs.org/docs/#api/textures/Texture) object that we can add to our `material`.

Create a `TextureLoader` under the geometry and then load the texture:

{{< highlight js >}}
...
  const geometry = new THREE.BoxBufferGeometry( 15, 15, 15 );

  const textureLoader = new THREE.TextureLoader();

  const texture = textureLoader.load( 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/crate.gif' );
...
{{< /highlight >}}

#### A note on working locally

At this point, if you are working locally instead of via codepen, and especially if you try to load this file from your hard drive rather than from Github, you may run into problems due to security restrictions on how JavaScript can read local files. These restrictions are there for a reason and I would not advise you to turn them off, although it is possible. You should take the time to set up a simple HTTP server instead - we'll go over that in  [Appendix A.1: Setting up a development server].

#### Adding the texture to the material

Next, well assign the texture to the [material.map](https://threejs.org/docs/#api/materials/MeshStandardMaterial.map) slot.

{{< highlight js >}}
...
  const texture = textureLoader.load( 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/crate.gif' );

  // create a material
  const material = new THREE.MeshStandardMaterial( {
    color: 0xffffff,
    map: texture,
  } );
...
{{< /highlight >}}

Take note that we've also set the material's colour back to white ( we could also remove the colour line completely since white is the default ).

This is because the material's colour gets combined with the material's texture, so if we left it as purple, the wooden side of the box would have a purple tint - and I do like purple, but not _that_ much.

{:.paragraph-notice}
The `material.map` slot is the material's 'colour map' ( AKA 'diffuse map' or even 'diffuse colour map'). If you look through the documentation you see that there are other map slots, such as the `normalMap`, `bumpMap` and `envMap` (environment map), which control other features of the material's appearance. Also, note that we are looking at the documentation for `MeshStandardMaterial` - most materials have a colour `.map` slot, but they may not have all the other maps.

Here's our wooden cube, happily spinning away. It looks very flat and shiny at the moment, and there are plenty of settings on the material that we can use to adjust that, which we will get to very soon.

<p data-height="400" data-theme-id="0" data-slug-hash="YYGEJV" data-default-tab="result" class='codepen'></p>
<script async="async" src="//codepen.io/assets/embed/ei.js"></script>
