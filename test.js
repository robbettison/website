"use strict";
addEventListener('load', start);


//be aware of functions attached to nodes : removechild(removes given child), appendChild(at the end of list of children),
//insertBefore(takes two arguments, inserts second node before the other argumenet node)
//replaceChild(similar to insertBefore but replaces second node with first node.)
//nice examples http://eloquentjavascript.net/13_dom.html

//offsetheight offsetwidth gives height and width of nodes
//clientheight/width gives the height and width not includng borders

//getboundingclient - returns object with top bottom left and right properties relative to the top left of the browser

//display:inline, display:block, display:none(hides the element)

//style.fontFamily="".

//p>a implies direct children of p, p a implies all children including indirect

//queryselectorall similar to querySelector except returns array of all nodes matching the selector.

//positioning and animating(requestanimationframe) -- check http://eloquentjavascript.net/13_dom.html at bottom of page

/*<p style="text-align: center">
  <img src="img/cat.png" style="position: relative">
</p>
<script>
  var cat = document.querySelector("img");
  var angle = 0, lastTime = null;
  function animate(time) {
    if (lastTime != null)
      angle += (time - lastTime) * 0.001;
    lastTime = time;
    cat.style.top = (Math.sin(angle) * 20) + "px";
    cat.style.left = (Math.cos(angle) * 20) + "px";
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
</script>*/

function start() {
  var b = document.querySelector("#dragbox");
  b.addEventListener('click', Destination);
}
function Destination() {
  var d = document.querySelector("#destinationbox");
  console.log("here");
  b.removeEventListener();
  d.addEventListener('click', Colourchange);
}
function Colourchange() {
  document.body.destinationbox.style.background = "red";
}
