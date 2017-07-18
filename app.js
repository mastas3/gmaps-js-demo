function initMap() {
  try {
    //hold references to all drawn shapes
    var shapesHistory = [];
    var draw = new DrawPolyShape();
    var center = { lat: 32.109333, lng: 34.855499 }; //israel
    var map = new google.maps.Map(document.getElementById("map"), {
      center: new google.maps.LatLng(center),
      disableDefaultUI: true,
      clickableIcons: false,
      zoom: 11
    });

    //set shapes options
    var polylineOptions = {
      fillColor: "#1E90FF",
      strokeColor: "#FF0000",
      fillOpacity: 1,
      strokeWeight: 5,
      clickable: true,
      editable: true,
      zIndex: 1
    };

    var circleOptions = {
      fillColor: "#1E90FF",
      strokeColor: "#FF0000",
      fillOpacity: 0.35,
      strokeWeight: 5,
      draggable: true,
      clickable: false,
      editable: true,
      zIndex: 1
    };

    var polygonOptions = {
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
      try {
        draw.init(shapesHistory, drawingManager)
        var drawPolyLineButton = document.getElementById("drawPolyLineButton");
        var drawCircleButton = document.getElementById("drawCircleButton");
        var drawPolyGonButton = document.getElementById("drawPolyGonButton");
        var clearButton = document.getElementById("clearButton");

        drawPolyLineButton.onclick = function(_e) {
          draw.polyline(shapesHistory, drawingManager);
        };

        drawCircleButton.onclick = function(_e) {
          draw.circle(shapesHistory, drawingManager);
        };

        drawPolyGonButton.onclick = function(_e) {
          draw.polygon(shapesHistory, drawingManager);
        };

        clearButton.onclick = function(_e) {
          while (allShapes.length > 0) {
            allShapes.pop().setMap(null);
          }
        };
      } catch (error) {
        console.log('setButtonsAndMapEventHandlers error: ', error)
      }
    })();
  } catch (error) {
    console.log("initMap error: ", error);
  }
}

function drawShape(_allShapes, _drawingManager, _type) {
  try {
    switch (_type) {
      case "POLYLINE":
        drawPolyline(_allShapes, _drawingManager);
        break;
      case "POLYGON":
        drawPolygon(_allShapes, _drawingManager);
        break;
      case "CIRCLE":
        drawCircle(_allShapes, _drawingManager);
        break;
    }
  } catch (error) {
    console.log("drawShape error: ", error);
  }
}

function DrawPolyShape() {
  this.init = function(_shapesHistory, _drawingManager) {
    this.shapesHistory = _shapesHistory;
    this.drawingManager = _drawingManager;
  }

  this.polygon = function() {
    try {
      this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
      google.maps.event.addListener("polygoncomplete", _polygon => {
          try {
            this.shapesHistory.push(_polygon);
            this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CURSOR);
            getShapeCoords(_polygon);
          } catch (error) {
            console.log('polygoncomplete handler error ', error)        
          }
        }
      );      
    } catch (error) {
      console.log('DrawPolyShape.polygon error', error);
    }
  }

  this.polyline = function() {
    try {
      this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
      google.maps.event.addListener(_drawingManager, "polylinecomplete", _polyline => {
          try {
            this.shapesHistory.push(_polyline);
            this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CURSOR);
            getShapeCoords(_polyline);            
          } catch (error) {
            console.log('polylinecomplete handler error ', error)        
          }
        }
      );      
    } catch (error) {
      console.log('DrawPolyShape.polyline error', error);
    }
  }

  this.circle = function() {
    try {
      this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CIRCLE);
      google.maps.event.addListener(
        _drawingManager,
        "circlecomplete",
        _circle => {
          this.shapesHistory.push(_circle);
          this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CURSOR);
          getCircleRadandCenter(_circle);
        }
      );      
    } catch (error) {
      console.log('DrawPolyShape.circle error', error)
    }
  }  
}

function getCircleRadandCenter(_circle) {
  try {
    var center = _circle.getCenter();
    var radius = _circle.getRadius();
    console.log("Circle center: " + center, "Radius: " + radius);
  } catch (error) {
    console.log("getCircleRadandCenter error: ", error);
  }
}

function getShapeCoords(_shape) {
  try {
    var coords = _shape.getPath().b.map(coord => coord.toUrlValue()); //change b
    console.log(coords);
  } catch (error) {
    console.log("getShapeCoords error: ", error);
  }
}

// function drawPolygon(_allShapes, _drawingManager) {
//   try {
//     _drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
//     google.maps.event.addListener(_drawingManager, "polygoncomplete", _polygon => {
//       try {
//         _allShapes.push(_polygon);
//         getShapeCoords(_polygon);
//         _drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CURSOR);
//       } catch (error) {
//         console.log('polygoncomplete handler error ', error)        
//       }
//       }
//     );
//   } catch (error) {
//     consoloe.log("drawPolygon error: ", error);
//   }
// }

// function drawPolyline(_allShapes, _drawingManager) {
//   try {
//     _drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
//     google.maps.event.addListener(
//       _drawingManager,
//       "polylinecomplete",
//       _polyline => {
//         _allShapes.push(_polyline);
//         getShapeCoords(_polyline);
//         _drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CURSOR);
//       }
//     );
//   } catch (error) {
//     console.log("drawPolyline error: ", error);
//   }
// }

// function drawCircle(_allShapes, _drawingManager) {
//   try {
//     _drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CIRCLE);
//     google.maps.event.addListener(
//       _drawingManager,
//       "circlecomplete",
//       _circle => {
//         _allShapes.push(_circle);
//         getCircleRadandCenter(_circle);
//         _drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CURSOR);
//       }
//     );
//   } catch (error) {
//     console.log("drawCircle error: ", error);
//   }
// }


