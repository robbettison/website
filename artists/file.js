"use strict";
addEventListener('load', start);

function start() {
var b = document.querySelector("body");
//"night and day mode"
//b.addEventListener("keydown", nightmode);
//b.addEventListener("keyup", daymode);
//allows drawing of dots
//addEventListener("click", whiteboard);
//gives help for filling form out
var help = document.querySelector("#help");
var fields = document.querySelectorAll("input");
/*for (var i = 0; i < fields.length; i++) {
  fields[i].addEventListener("focus", inputHelp);
  fields[i].addEventListener("blur", noHelp);
}*/

/*setTimeout(function() {
  document.body.style.background = "black";
}, 1000);*/
/*var wave = document.querySelector("#wave");
wave.addEventListener('click', move);*/
/*var title=document.querySelector("h1");
title.addEventListener('click', enlargen);*/
}

function noHelp(event) {
  var help = document.querySelector("#help");
  help.textContent = "";
}

function inputHelp(event) {
  var text = event.target.getAttribute("data-help");
  var help = document.querySelector("#help");
  help.textContent = text;
  //help.text-align:center;
}

function nightmode(event) {
  document.body.style.background = "white";
}

function daymode(event) {
  document.body.style.background = "black";
}

function whiteboard(event) {
  var dot = document.createElement("div");
  dot.className = "dot";
  dot.style.left = (event.pageX - 4) + "px";
  dot.style.top = (event.pageY - 4) + "px";
  document.body.appendChild(dot);
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
