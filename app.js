var allShapes = [];

function initMap() {
  try {
    let center = { lat: 33.5190755, lng: -111.9253654 };
    let map = new google.maps.Map(document.getElementById("map"), {
      center: new google.maps.LatLng(center),
      zoom: 11
    });

    //initialize event listeners on drawing buttons
    (function drawingButtonsEventListenerInit() {
      let drawPolyLineButton = document.getElementById("drawPolyLineButton");
      let drawCircleButton = document.getElementById("drawCircleButton");
      let drawPolyGonButton = document.getElementById("drawPolyGonButton");
      let clearButton = document.getElementById("clearButton");

      drawPolyLineButton.onclick = function(_e) {
        drawPolyline(map, center);
      };

      drawCircleButton.onclick = function(_e) {
        drawCircle(map, center);
      };

      drawPolyGonButton.onclick = function(_e) {
        drawPolygon(map, center);
      };

      clearButton.onclick = function(_e) {
        alert("clear");
        allShapes.forEach(shape => shape.pop().setMap(null))
      };
    })();
  } catch (error) {
    console.log("initMap error: " + error);
  }
}

function drawPolygon(_map, _startingCoord) {
  try {
    let destinations = new google.maps.MVCArray();
    destinations.push(new google.maps.LatLng(_startingCoord));
    allShapes.push(new google.maps.LatLng(_startingCoord));
    //define a polygon
    let polygon = new google.maps.Polygon({
      paths: destinations,
      draggable: true,
      editable: true,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35
    });

    //handle click events on map
    google.maps.event.addListener(_map, "click", addCoords);
    function addCoords(_e) {
      let currentPath = polygon.getPath();
      currentPath.push(_e.latLng);
      allShapes.push(_e.latLng);
    }

    //handle polygon user changes: dragging \ resizing \ adding coords
    google.maps.event.addListener(
      polygon.getPath(),
      "insert_at",
      getPolygonCoords
    );
    google.maps.event.addListener(
      polygon.getPath(),
      "set_at",
      getPolygonCoords
    );
    function getPolygonCoords() {
      let coords = polygon.getPath().b.map(coord => coord.toUrlValue());
      console.log(coords);
    }

    //set polygon on map
    polygon.setMap(_map);
  } catch (error) {
    consoloe.log("drawPolygon error: " + error);
  }
}

function drawPolyline(_map, _startingCoord) {
  try {
    let destinations = new google.maps.MVCArray();
    destinations.push(new google.maps.LatLng(_startingCoord));

    //define a polyline
    let polyline = new google.maps.Polyline({
      strokeColor: "#FF0000"
    });

    //handle click events on map
    google.maps.event.addListener(_map, "click", addCoords);
    function addCoords(_e) {
      let currentPath = polyline.getPath();
      currentPath.push(_e.latLng);
    }

    //handle polygon user changes: dragging \ resizing \ adding coords
    google.maps.event.addListener(
      polyline.getPath(),
      "insert_at",
      getPolylineCoords
    );
    google.maps.event.addListener(
      polyline.getPath(),
      "set_at",
      getPolylineCoords
    );
    function getPolylineCoords() {
      let coords = polyline.getPath().b.map(coord => coord.toUrlValue());
      console.log(coords);
    }

    //set polyline on map
    polyline.setMap(_map);
  } catch (error) {
    console.log("drawPolyline error: " + error);
  }
}

function drawCircle(_map, _startingCoord) {
  try {
    let destinations = new google.maps.MVCArray();
    destinations.push(new google.maps.LatLng(_startingCoord));

    let polyline = new google.maps.Polyline({
      strokeColor: "#FF0000"
    });

    google.maps.event.addListener(_map, "click", addCoords);
    function addCoords(_e) {
      try {
        let currentPath = polyline.getPath();
        currentPath.push(_e.latLng);
      } catch (error) {}
    }

    google.maps.event.addListener(
      polyline.getPath(),
      "insert_at",
      getPolylineCoords
    );
    google.maps.event.addListener(
      polyline.getPath(),
      "set_at",
      getPolylineCoords
    );
    function getPolylineCoords() {
      let coords = polyline.getPath().b.map(coord => coord.toUrlValue());
      console.log(coords);
    }

    polyline.setMap(_map);
  } catch (error) {
    console.log("drawCircle error: " + error);
  }
}
