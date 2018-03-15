---
title: "CSS Circles Animation"
date: 2017-09-01
description: "An experiment in pure CSS animation, using art created with the EscherSketch hyperbolic art generator."
tags: ['css', 'scss', 'animation']
teaserImage: /images/experiments/circles/teaser.jpg
css: circles
menu: experiments
menuTitle: "BlackThread.io: Experiments"
weight: 3
---
Pretty circles with a pure CSS animation hover effect.
They were originally intended for the front page of this site.
I decided not to use them there since I wanted to showcase some WebGL, but I still think they look nice!

They're fully responsive too, so go ahead and resize the browser window.

They were originally inspired by something I found on CodePen, however I can't find it again to provide proper attribution - so, thank you mystery coder for the inspiration!

The background art was created as a series of "mistakes" while working on my hyperbolic tesselation generator, AKA EscherSketch, which you can find [here](/experiments/eschersketch/).

The animation is created using a multiple css `box-shadows`, along with hover animations
and changing background image sizes.

<div id="circles">
  <div id="circle-1" class="circle"></div>
  <div id="circle-2" class="circle"></div>
  <div id="circle-3" class="circle"></div>
  <div id="circle-4" class="circle"></div>
</div>
