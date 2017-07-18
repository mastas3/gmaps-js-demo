var allShapes = [];

function initMap() {
  let map = new google.maps.Map(document.getElementById("map"), {
    center: new google.maps.LatLng(33.5190755, -111.9253654),
    zoom: 11
  });

  let triangleCoords = [
    new google.maps.LatLng(33.5362475, -111.9267386),
    new google.maps.LatLng(33.5104882, -111.9627875),
    new google.maps.LatLng(33.5004686, -111.9027061)
  ];
  // Styling & Controls
  let polygon = new google.maps.Polygon({
    paths: triangleCoords,
    draggable: true, // turn off if it gets annoying
    editable: true,
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.35
  });

  polygon.setMap(map);

  google.maps.event.addListener(
    polygon.getPath(),
    "insert_at",
    getPolygonCoords
  );
  google.maps.event.addListener(polygon.getPath(), "insert_at", getPolygonCoords);
  google.maps.event.addListener(polygon.getPath(), "set_at", getPolygonCoords);

  function getPolygonCoords() {
    let length = polygon.getPath().getLength();
    let coords = polygon.getPath().b.map(coord => coord.toUrlValue());

    console.log(coords);
  }

  // function getRawCoordsData()
}
