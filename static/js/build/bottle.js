this.bottle = this.bottle || {};
(function (babelPolyfill,bottleLayout,BottleCanvas) {
'use strict';

bottleLayout = bottleLayout && bottleLayout.hasOwnProperty('default') ? bottleLayout['default'] : bottleLayout;
BottleCanvas = BottleCanvas && BottleCanvas.hasOwnProperty('default') ? BottleCanvas['default'] : BottleCanvas;

bottleLayout();

new BottleCanvas(document.querySelector('#canvas'), null, 0xcccccc);

}(null,bottleLayout,BottleCanvas));
