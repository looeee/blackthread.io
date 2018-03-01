---
title:  "The Object3D base class"
excerpt: "Everything you need to know about the Object3D base class in three.js"
menu: tutorials
menuTitle: Three.js tutorials
menuNumber: "2.1"
weight: 15
readTime: true
draft: true
---

# DRAFT COPY

If you look through the three.js documentation, you'll see that each classes hierarchy is listed at the top of the page - for example at  top of the the [PerspectiveCamera](https://threejs.org/docs/#api/cameras/PerspectiveCamera) page you'll see

[Object3D](https://threejs.org/docs/#api/core/Object3D) &rarr; [Camera](https://threejs.org/docs/#api/cameras/Camera) &rarr;

which means that the PerspectiveCamera inherits from the [Camera](https://threejs.org/docs/#api/cameras/Camera) base class (as do all cameras), which in turn inherits from [Object3D](https://threejs.org/docs/#api/core/Object3D) class. This is very important, as in general each class inherits all the properties and methods of the classes higher up the inheritance chain (although they may have different defaults or in some cases be disabled). If you do not make note of this then you are likely to miss documentation of important functionality. For example, if you just look at the PerspectiveCamera's docs page, you miss it's [.clone](https://threejs.org/docs/#api/cameras/Camera.clone) property which is documented on the Camera page, one step up the inheritance chain.

The most important base class is [Object3D](https://threejs.org/docs/#api/core/Object3D). You'll rarely use this directly, but all of it's properties and methods are inherited by every three.js object that has a position in 3D space. This includes:
* [Audio](https://threejs.org/docs/#api/audio/Audio), [AudioListener](https://threejs.org/docs/#api/audio/AudioListener), [PositionalAudio](https://threejs.org/docs/#api/audio/PositionalAudio)
* All helpers
* [Bone](https://threejs.org/docs/#api/objects/Bone) and [Skeleton](https://threejs.org/docs/#api/objects/Skeleton)
* [Camera](https://threejs.org/docs/#api/cameras/Camera) and all derived classes (i.e. all cameras)
* [Curve](https://threejs.org/docs/#api/extras/core/Curve) and all derived classes (i.e. all curve, path and shape and text objects)
* [Line](https://threejs.org/docs/#api/extras/core/Line) and it's derived classes ([LineSegments](https://threejs.org/docs/#api/objects/LineSegments) and [LineLoop](https://threejs.org/docs/#api/objects/LineLoop))
* [Group](https://threejs.org/docs/#api/objects/Group)
* [ImmediateRenderObject](https://threejs.org/docs/#api/extras/objects/ImmediateRenderObject)
* [LensFlare](https://threejs.org/docs/#api/objects/LensFlare)
* [Light](https://threejs.org/docs/#api/lights/Light) and all derived classes (i.e. all lights)
* [LOD](https://threejs.org/docs/#api/objects/LOD)
* [Mesh](https://threejs.org/docs/#api/objects/Mesh) and it's classes.
* [Points](https://threejs.org/docs/#api/objects/Points)
* [Scene](https://threejs.org/docs/#api/scenes/Scene)
* [Sprite](https://threejs.org/docs/#api/objects/Sprite)

As you can see, a lot of things inherit from Object3D! So we should definitely become familiar with it.

First, it's worth noting one type of thing that, perhaps surprisingly, does not inherit from Object3D - that is, all [Geometries](https://threejs.org/docs/#api/core/Geometry), [BufferGeometries](https://threejs.org/docs/#api/core/BufferGeometry) and their derived classes. The idea is you provide a geometry (or preferably, a buffer geometry) to the mesh, *after* you have made any necessary adjustments to it's position (translation), scale, rotation and so on. The Mesh works as a kind of container that then provides methods for translating (moving), rotating or scaling the object in the 3D world space.

## A mathematical aside - affine transformations and matrices
We'll pause for a moment here and introduce a couple of mathematical concepts that you will need, in a very non-technical and imprecise manner. You don't need to worry about having any kind of deep understanding of these yet, but at some point in your adventure in 3D space you should consider studying this stuff. It's nearly all classed under the term [Linear Algebra](https://en.wikipedia.org/wiki/Linear_algebra), and if you do a search for "3D mathematics" or anything similar you'll find a lot of resources. Pick something basic to start with.

### Affine transformations
The collective technical term for translation, scale, rotation and other similar 3D operations is *transformations* (even more technically [affine transformations](https://en.wikipedia.org/wiki/Affine_transformation)).

Non-technically, an affine transformation is any movement or change in size or shape that preserves points, straight lines, planes and parallel lines. Intuitively, you can think of them as any *normal* movement in 3D space, including shrinking or stretching and shearing. All of the transformation that you can make in three.js are affine transformations - non-affine transformations are not supported, and in the rare case that you do need one, you'll have to roll your own. But you'll probably never have to worry about that. Make a mental note and let's move on.

### Matrices
$$  \begin{pmatrix}
  1 & 4 & 4 & 2 \\
  5 & 1 & 2 & 3 \\
  2 & 8 & 7 & 6 \\
  3 & 8 & 0 & 2
 \end{pmatrix} $$
{: .align-left}
A matrix is an efficient way of storing numbers in a rectangular array. You may have seen them before, even if you haven't studied them. On the left is a 4x4 square matrix - it has four rows and four columns, and the same number of rows as columns so it is called *square*. Matrices can hold all kinds of information, but we are particularly interested in the fact that they can very efficiently hold any combination of sequences of affine transformations - so if we want to translate an object 3 units along the x axis, then rotate it by some amount around the y axis, then scale it to twice it's current size, we can store all this information in a single 4x4 [Transformation Matrix](https://en.wikipedia.org/wiki/Transformation_matrix) - see in particular the section on [affine transformations](https://en.wikipedia.org/wiki/Transformation_matrix#Affine_transformations) on that page if you want to go deeper.

The official docs page for [Matrix4](https://threejs.org/docs/#api/math/Matrix4) has some more information on this, as well as details on the common matrices used.

## Object3D Properties

Now that we have seen *why* we should understand Object3D so well, let's take a look at some of it's most important properties. We won't look at all of them here - this is not a reference book after all, and quite a few of them are only intended to be used internally or by advanced users.

### Matrix properties
Every Object3D has a couple of transformation matrices that we should take note of, at least in passing. although we will rarely use them directly.
* [.matrix](https://threejs.org/docs/#api/core/Object3D.matrix): this holds the local transform of the object. Any transformation of the object's children will be relative to this. We'll come back to this when we look at the scene graph and grouping objects.
* [.matrixWorld](https://threejs.org/docs/#api/core/Object3D.matrixWorld]): how the object is transformed relative to it's parent - in general this will be the main [Scene](https://threejs.org/docs/#api/scenes/Scene). Again, we'll take a deeper look at this in the next chapters. Setting the corresponding [.matrixWorldNeedsUpdate](https://threejs.org/docs/#api/core/Object3D.matrixWorldNeedsUpdate) to `true` will update this matrix in the next frame and then reset the property to `false`.
* [modelViewMatrix](https://threejs.org/docs/#api/core/Object3D.modelViewMatrix): after the object has been transformed in world space, it is transformed relative to the camera. This transformation is stored here.

### Transformation properties
These properties relate to the [.matrix](https://threejs.org/docs/#api/core/Object3D.matrix)described above - i.e. they are used to set the local transform of the object. If the [matrixAutoUpdate](https://threejs.org/docs/#api/core/Object3D.matrixAutoUpdate) property is set to `true` (which it is by default), then the matrix is updated to hold the combined transformation represented by these properties.

In other words, instead of trying to set the matrix manually, we can just adjust the position, scale and rotation as we please and be confident that the matrix will be updated automatically in the next frame.
* [.position](https://threejs.org/docs/#api/core/Object3D.position) - a [Vector3](https://threejs.org/docs/#api/math/Vector3) holding the position of the object, in the order `x, y, z`. You can set all of the values at once with `object.position.set( newX, newY, newZ)`, or individually with `object.position.x = newX` and so on.
* [.rotation](https://threejs.org/docs/#api/core/Object3D.rotation) - an Euler angle representing the object's rotation in radians. What the hell is an Euler angle? Well, see below for a very quick overview. But for now, just think of this as being the same as Vector3 containing the x, y and z rotation of the object, and you can change the values in the same way as the  position above. But be sure to read the note on radians below.
* [.scale](https://threejs.org/docs/#api/core/Object3D.scale) - another Vector3, this time holding the scale of the object along its x, y and z axes. To start with it will be set to `(1, 1, 1)`, which means the object is scaled at 100% along all axes. To half it's size, do `object.scale.set( 0.5, 0.5, 0.5 )`, or `object.scale.set( 2, 2, 2 )` will double it. To half it's width (x axis), use `object.scale.x = 0.5`, and to double it's height (y axis), use `object.scale.y = 2`. And so on.

But wait, there's one more transformation property that we need to look at:
* [.quaternion](https://threejs.org/docs/#api/core/Object3D.quaternion) - a [Quaternion](https://threejs.org/docs/#api/math/Quaternion). According to the docs "This is used for rotating things without encountering the dreaded gimbal lock issue, amongst other advantages." Pretty cryptic, what could this thing be? Well, hold on, we'll explain it in a minute.

## A rotational mathematical aside - radians, Euler angles and Quaternions
We need to take another quick informal look at some more mathematics before we proceed, this time all things rotational. It turns out that rotating things is a little bit more complex than setting the position or scale, and there are a couple of things that we should know about before proceeding. The first two, radians and Euler angles are easy. Quaternions, though, are quite complex. Well, like most things mathematical, they are actually quite simple, once you've spent several days understanding them. But don't worry, we can largely ignore them for now.

### Radians
Angles in 3D space are rarely specified in degrees, which is unfortunate, because you are probably familiar with degrees. Instead, they are specified in [radians](https://en.wikipedia.org/wiki/Radian). On the other hand, it is very simple to convert degrees to radians, and vice versa.

$$angle \,\, in \,\, radians = (angle \,\, in \,\, degrees) \,. \frac{\pi}{180^{\circ}}$$

So, to convert say, $$125^{\circ}$$, we find that it is

$$125 \,. \frac{\pi}{180} = 2.18166 \, radians$$

This would be a good time to write yourself an little helper utility - something like:

{% highlight js %}
function toRadians( angle ) {
  return angle * ( Math.PI / 180 );
}
{% endhighlight %}

Or the ES6 version:

{% highlight js %}
const toRadians = ( angle ) => angle * ( Math.PI / 180 );
{% endhighlight %}

For completeness, the opposite formula is:

$$angle \,\, in \,\, degrees = (angle \,\, in \,\, radians) \,. \frac{180^{\circ}}{\pi}$$

### Euler angles
[Euler angles](https://en.wikipedia.org/wiki/Euler_angles) represent something that will (hopefully) match very closely to your intuition about how to rotate an object in 3D space, with just a couple of things to watch out for. Basically, we stick an x axis through the width of our object, then a y axis from top to bottom, and a z axis going from front to back, then we define rotations around the axes, remembering to specify the rotations in radians.

So, to rotate 90 degrees (1.5708 radians) around the x axis, then 45 degrees (0.785398 radians) around the y axis, we can set our rotation like so:

{% highlight js %}
object.rotation.set( 1.5708, 0.785398, 0)
{% endhighlight %}

If you check the [docs](https://threejs.org/docs/#api/math/Euler) page, you'll see that, beside the x, y and z properties which specify rotations around the corresponding axes, there is another property called [.order](https://threejs.org/docs/#api/math/Euler.order). It turns out that there are lots of other ways of defining Euler angles and three.js uses the *intrinsic* Tait-Bryan, colloquially known as *yaw*, *pitch* and *roll*.

A final note - the reason this ordering is important is that the rotations are applied separately around each axis - *first* the x-axis, *then* the y-axis, *then* the z-axis. This won't generally cause you problems, but you should keep it in mind.

### Quaternions
Behind the scenes, three.js entirely uses [quaternions](https://en.wikipedia.org/wiki/Quaternions_and_spatial_rotation) for calculating rotation. They are sometimes faster and have some other advantages, such as avoiding [gimbal lock](https://en.wikipedia.org/wiki/Gimbal_lock). But they have one major disadvantage - they are considerably more complex for humans to use, at least until we have spent a long time working with them. We have a lifetime of familiarity with Euler angles, even if we didn't know that's what they were called, however quaternions will be conceptually unfamiliar to most of us, rendering our intuitions much less useful.

It's OK though, because we can completely ignore them for our entire three.js careers and be none the worse off. Mainly.

And that is exactly what we are going to do here, unfortunately. It would take a few pages to introduce the mathematics and get up to speed with using it to calculate rotations, and this section is about getting up to speed with three.js, not mathematics. So, we'll stick with the Euler angles. Digression over (but do study this fascinating topic yourself).

## Back to the properties

### Other properties

* [.children](https://threejs.org/docs/#api/core/Object3D.children) - an array containing all child objects. We'll go over this again in when we look at the scene graph and grouping objects.
* [.name](https://threejs.org/docs/#api/core/Object3D.name) - if you want, you can add a name string to your object, which you can then use for debugging purposes, or for searching through your scene with the [.getObjectByName( name )](https://threejs.org/docs/#api/core/Object3D.getObjectByName) method.
* [.onAferRender](https://threejs.org/docs/#api/core/Object3D.onAfterRender) and [.onBeforeRender](https://threejs.org/docs/#api/core/Object3D.onBeforeRender) - these are empty functions by default. You can replace them with anything you want to be executed just before or just after *this* object is rendered, allowing for very fine control in the rendering pipeline.
* [.parent](https://threejs.org/docs/#api/core/Object3D.parent) - if the object has a parent, in particular if it has been added to the [Scene](https://threejs.org/docs/#api/scenes/Scene) directly (i.e not as the child of some other object), then a reference to that parent is kept here. Note that an object can have only one parent.