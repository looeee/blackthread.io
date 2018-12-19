---
title:  "EscherSketch"
date: 2017-02-02
description: "Prototype of a hyperbolic art generator and educational to h that creates a regular edge to edge tiling of the hyperbolic plane. If you are a fan of M.C Escher you will certainly recognise this from his Circle Limit series"
tags: ['hyperbolic', 'mathematics', 'escher', 'tiling']
teaserImage: /images/experiments/escherSketch/teaser.jpg
js: escherSketch
css: escherSketch
menu: experiments
menuTitle: "BlackThread.io: Experiments"
weight: 2
---
This is a prototype of an automatic hyperbolic art generator and educational tool.
It creates a regular edge to edge [tiling of the hyperbolic plane](https://en.wikipedia.org/wiki/Uniform_tilings_in_hyperbolic_plane)
represented as a [Poincaré disk](https://en.wikipedia.org/wiki/Poincar%C3%A9_disk_model),
also known as a hyperbolic tesselation.


These were originally described by
[H. S. M. Coxeter](https://en.wikipedia.org/wiki/Harold_Scott_MacDonald_Coxeter), but were made famous by [M.C. Escher](https://en.wikipedia.org/wiki/M._C._Escher)
in his series of Circle Limit woodcuts, back in the era when people were known only by their initials and surnames.

Currently it can create images similar to Escher's [Circle Limit I](https://www.wikiart.org/en/m-c-escher/circle-limit-i).
These are regular two colored tilings, defined by the number of sides of the polygons, and the
number of polygons that meet at each vertex.

The tiling is created out out of two Euclidean triangular pieces, one representing half a
white fish, the other half a black fish.

{{< figure src="/images/experiments/escherSketch/fish.png" caption="Fig 1: Black fish, white fish" alt="Fish tiles" class="figure-small" >}}

I had originally planned to extend this to include irregular tilings of several colors, which would
allow the creation of the rest oas a teaching tool where students could create their own tiles.

Unfortunately, creating the tiles so that they match evenly turned out to be more difficult than I expected.
It's quite unintuitive since the Euclidean triangles get stretched to map onto hyperbolic
triangles, and the lines of opposing edges don't match up where you would expect.
Since the intention was to create a simple educational tool where students could quickly create
their own designs, this was a bit of a showstopper, and I halted development.

Note that once you go over around 8 for either values the polygons will start to get very stretched at the edges.

<div id="controls">
  <div id="p-selection">
    <span>Central polygon sides: </span>
    <a href="#" id="p-down">
      <span class="fa fa-chevron-left" aria-hidden="true"></span>
    </a>
    <span id="p-value">6</span>
    <a href="#" id="p-up">
      <span class="fa fa-chevron-right" aria-hidden="true"></span>
    </a>
  </div>
  <div id="q-selection">
    <span>Polygons meeting at each vertex: </span>
    <a href="#" id="q-down">
      <span class="fa fa-chevron-left" aria-hidden="true"></span>
    </a>
    <span id="q-value">6</span>
    <a href="#" id="q-up">
      <span class="fa fa-chevron-right" aria-hidden="true"></span>
    </a>
  </div>
</div>

<p id="warn" class="hide"><strong>Invalid tiling!</strong></p>
<canvas id="canvas"></canvas>


Your current tiling consists of <span id="tiling-length"></span> hyperbolic polygons.

This way this works by mapping the two triangular images to hyperbolic triangles (a non-affine texture mapping), and then covering the central polygon with them.
Then this central polygon is appropriately rotated and repeated until the entire plane is covered.

The following figure is a {4, 5} tiling - that means 4 sided polygons, with 5 meeting at each vertex.

{{< figure src="/images/experiments/escherSketch/uniform-hyperbolic-tiling-45.png" caption="Fig 2: A {4, 5} tiling" alt="Hyperbolic tiling" class="figure-medium" >}}

The algorithm used was first described by [Douglas Dunham](https://www.d.umn.edu/~ddunham/) and as far as I can tell first implemented in software by his PHD student Ajit Datar.

However, this is almost certainly the first implementation using JavaScript and WebGL.

If you are interested in reading more about hyperbolic tesselation, check out the Dr. Dunham's homepage linked above, or for a slightly gentler introduction, try [this](https://mathcs.clarku.edu/~djoyce/poincare/poincare.html) page by Prof. Joyce at Clare university, as well the [wikpedia](https://en.wikipedia.org/wiki/Uniform_tilings_in_hyperbolic_plane) page.