function initMap() {
  try {
    //hold references to all drawn shapes
    var allShapes = [];
    let center = { lat: 32.109333, lng: 34.855499 }; //israel
    let map = new google.maps.Map(document.getElementById("map"), {
      center: new google.maps.LatLng(center),
      disableDefaultUI: true,
      clickableIcons: false,
      zoom: 11
    });

    //set shapes options
    let polylineOptions = {
      fillColor: "#1E90FF",
      strokeColor: "#FF0000",
      fillOpacity: 1,
      strokeWeight: 5,
      clickable: true,
      editable: true,
      zIndex: 1
    };

    let circleOptions = {
      fillColor: "#1E90FF",
      strokeColor: "#FF0000",
      fillOpacity: 0.35,
      strokeWeight: 5,
      draggable: true,
      clickable: false,
      editable: true,
      zIndex: 1
    };

    let polygonOptions = {
      fillColor: "#1E90FF",
      strokeColor: "#FF0000",
      fillOpacity: 0.35,
      strokeWeight: 5,
      draggable: true,
      clickable: false,
      editable: true,
      zIndex: 1
    };

    //include drawing functionallity
    var drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.CURSOR,
      drawingControl: false, //set false to hide googles default buttons
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ["circle", "polygon", "polyline"]
      },
      polylineOptions: polylineOptions,
      circleOptions: circleOptions,
      polygonOptions: polygonOptions
    });

    //append drawing functionality to our map
    drawingManager.setMap(map);

    //initialize event listeners on drawing buttons
    (function setButtonsAndMapEventHandlers() {
      let drawPolyLineButton = document.getElementById("drawPolyLineButton");
      let drawCircleButton = document.getElementById("drawCircleButton");
      let drawPolyGonButton = document.getElementById("drawPolyGonButton");
      let clearButton = document.getElementById("clearButton");

      //get new center center of map after draggin it around
      google.maps.event.addListener(map, "dragend", function() {
        center = map.getCenter();
      });

      //get new center of map after zooming in\out
      google.maps.event.addListener(map, "idle", function() {
        center = map.getCenter();
      });

      drawPolyLineButton.onclick = function(_e) {
        drawShape(map, allShapes, drawingManager, "POLYLINE");
      };

      drawCircleButton.onclick = function(_e) {
        drawShape(map, allShapes, drawingManager, "CIRCLE");
      };

      drawPolyGonButton.onclick = function(_e) {
        drawShape(map, allShapes, drawingManager, "POLYGON");
      };

      clearButton.onclick = function(_e) {
        while (allShapes.length > 0) {
          allShapes.pop().setMap(null);
        }
      };
    })();
  } catch (error) {
    console.log("initMap error: " + error);
  }
}

function drawShape(_map, _allShapes, _drawingManager, _type) {
  try {
    switch (_type) {
      case "POLYLINE":
        drawPolyline(_map, _allShapes, _drawingManager);
        break;
      case "POLYGON":
        drawPolygon(_map, _allShapes, _drawingManager);
        break;
      case "CIRCLE":
        drawCircle(_map, _allShapes, _drawingManager);
        break;
    }
  } catch (error) {
    console.log("drawShape error: " + error);
  }
}

function drawPolygon(_map, _allShapes, _drawingManager) {
  try {
    _drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    google.maps.event.addListener(
      _drawingManager,
      "polygoncomplete",
      _polygon => {
        _allShapes.push(_polygon);
        getShapeCoords(_polygon);
        _drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CURSOR);
      }
    );
  } catch (error) {
    consoloe.log("drawPolygon error: " + error);
  }
}

function drawPolyline(_map, _allShapes, _drawingManager) {
  try {
    _drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
    google.maps.event.addListener(
      _drawingManager,
      "polylinecomplete",
      _polyline => {
        _allShapes.push(_polyline);
        getShapeCoords(_polyline);
        _drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CURSOR);
      }
    );
  } catch (error) {
    console.log("drawPolyline error: " + error);
  }
}

function drawCircle(_map, _allShapes, _drawingManager) {
  try {
    _drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CIRCLE);
    google.maps.event.addListener(
      _drawingManager,
      "circlecomplete",
      _circle => {
        _allShapes.push(_circle);
        getCircleRadandCenter(_circle);
        _drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CURSOR);
      }
    );
  } catch (error) {
    console.log("drawCircle error: " + error);
  }
}

function getCircleRadandCenter(_circle) {
  try {
    let center = _circle.getCenter();
    let radius = _circle.getRadius();
    console.log("Circle center: " + center, "Radius: " + radius);
  } catch (error) {
    console.log("getCircleRadandCenter error: " + error);
  }
}

function getShapeCoords(_shape) {
  try {
    let coords = _shape.getPath().b.map(coord => coord.toUrlValue());
    console.log(coords);
  } catch (error) {
    console.log("getShapeCoords error: " + error);
  }
}
