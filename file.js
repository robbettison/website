"use strict";
addEventListener('load', start);

function start() {
/*var b = document.querySelector("dfn");
b.addEventListener('click', popup);*/
/*var wave = document.querySelector("#wave");
wave.addEventListener('click', move);*/
/*var title=document.querySelector("h1");
title.addEventListener('click', enlargen);*/
}

/*function enlargen(event) {
  var top = 0
  function frame() {
    console.log('here');
    top++;
    var elem = document.querySelector("h1").style;

    elem.fontSize = top + elem.fontSize +'%';
    if (top == 3) {
      clearInterval(id);
    }
  }
  var id = setInterval(frame, 10);
}*/

function popup(event) {
  alert("Wavey vibes..");
  console.log('wave');

}

function move(event) {

  var top = 0
  function frame() {
    top++;
    var elem = document.querySelector("#wave").style;
    elem.top = top + 'px';
    if (top == 200) {
      clearInterval(id);
      elem.top = 0;
    }
  }
  var id = setInterval(frame, 10);
}
