---
title: "CSS Circles Animation"
date: 2017-09-01T00:00:00-00:00
description: "An experiment in pure CSS animation, using art created with the EscherSketch hyperbolic art generator."
teaserImage: /images/experiments/circles/teaser.jpg
css: circles
menu: experiments
menuTitle: Blackthread Experiments
weight: 2
---

<p>
    Pretty circles with a pure CSS animation hover effect.
    They were originally intended for the front page of this site.
    I decided not to use them there since I wanted to showcase some WebGL, but I still think they look nice!
    They're fully responsive too, so go ahead and resize the browser window.
</p>

<p>
  They were originally inspired by something I found on CodePen, however I can't find
  it again to provide proper attribution - so, thank you mystery coder for the inspiration!
</p>

<p>
  The background art was created as a series of "mistakes" while working on my hyperbolic tesselation generator,
  AKA EscherSketch, which you can find <a href="/experiments/eschersketch/">here</a>.
</p>

<p>
  The animation is created using a multiple css `box-shadows`, along with hover animations
  and changing background image sizes.
</p>

<div id="circles">

  <div id="circle-1" class="circle"></div>

  <div id="circle-2" class="circle"></div>

  <div id="circle-3" class="circle"></div>

  <div id="circle-4" class="circle"></div>

</div>
