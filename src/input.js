
function whatKey(evt) {

     switch (evt.keyCode) {

         // Left arrow.
     case 37:
         canvasTranslate.addPoint(new Point(-translateX, 0));
         ctx.translate(-translateX, 0);
         break;

         // Right arrow.
     case 39:
         canvasTranslate.addPoint(new Point(translateX, 0));
         ctx.translate(translateX, 0);
         break;

         // Down arrow
     case 40:
         canvasTranslate.addPoint(new Point(0, translateY));
         ctx.translate(0, translateY);

         break;

         // Up arrow 
     case 38:
         canvasTranslate.addPoint(new Point(0, -translateY));
         ctx.translate(0, -translateY);

         break;

     default:
         alert("Please only use the arrow keys.");
     }
 }