---
title: "Ribbons"
date: 2017-05-12T00:00:00-00:00
description: "An experiment in creating ribbons - lines of any thickness - which is not possible by default in thee.js"
teaserImage: /images/experiments/ribbons/teaser.jpg
js: ribbons
menu: experiments
menuTitle: Blackthread Experiments
weight: 3
---

<p>
  Most browsers are unable to display thick lines with WebGL - the lines will always be
  rendered at 1px, no matter what the thickness is set to.
</p>
<p>
  In this experiment the lines are generated as thin triangle strips, allowing for lines of
  any thickness.
</p>
<p>
  Note that with this implementation, the thickness is a property of the geometry,
  so that if the camera zooms in the lines will get thicker.
  Work is being done on a "screen space" implementation of thick lines in the three.js core
  (so that the lines will always be rendered at same thickness),
  which will likely be added in the next release at time of writing (r89).
</p>
<canvas id="canvas"></canvas>
