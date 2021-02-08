const OnMouseMove = (e) => {
  var x = e.clientX;
  var y = e.clientY;
  var coor = "Coordinates: (" + x + "," + y + ")";
  document.getElementById("onmouse").innerHTML = coor;
}

export default OnMouseMove
