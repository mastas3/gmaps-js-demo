function initMap() {
  try {
    //hold references to all drawn shapes
    var shapesHistoryArr = [];
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
        draw.init(shapesHistoryArr, drawingManager);
        var drawPolyLineButton = document.getElementById("drawPolyLineButton");
        var drawCircleButton = document.getElementById("drawCircleButton");
        var drawPolyGonButton = document.getElementById("drawPolyGonButton");
        var clearButton = document.getElementById("clearButton");

        drawPolyLineButton.onclick = function(_e) {
          draw.polyline(_e);
        };

        drawCircleButton.onclick = function(_e) {
          draw.circle(_e);
        };

        drawPolyGonButton.onclick = function(_e) {
          draw.polygon(_e);
        };

        clearButton.onclick = function(_e) {
          while (shapesHistoryArr.length > 0) {
            shapesHistoryArr.pop().setMap(null);
          }
        };
      } catch (_error) {
        console.log("setButtonsAndMapEventHandlers error: ", _error);
      }
    })();
  } catch (_error) {
    console.log("initMap error: ", _error);
  }
}

//drawing class
function DrawPolyShape() {
  this.init = function(_shapesHistoryArr, _drawingManager) {
    this.shapesHistoryArr = _shapesHistoryArr;
    this.drawingManager = _drawingManager;
    circleCompleteEventListener();
    polylineCompleteEventListener();
    polygonCompleteEventListener();
  };

  this.polygon = function() {
    try {
      this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    } catch (_error) {
      console.log("DrawPolyShape.polygon error", _error);
    }
  };

  this.polyline = function() {
    try {
      this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
    } catch (_error) {
      console.log("DrawPolyShape.polyline error", _error);
    }
  };

  this.circle = function() {
    try {
      this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CIRCLE);
    } catch (_error) {
      console.log("DrawPolyShape.circle error", _error);
    }
  };

  var circleCompleteEventListener = () => {
    try {
      google.maps.event.addListener(this.drawingManager, "circlecomplete", _circle => {
        try {
          this.shapesHistoryArr.push(_circle);
          this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CURSOR);
          getCircleRadandCenter(_circle);

          //handle "radius changed" event (when you resize the circle)
          google.maps.event.addListener(_circle, "radius_changed", () => getCircleRadandCenter(_circle));
          //handle "center changed" event (when you move the circle)
          google.maps.event.addListener(_circle, "center_changed", () => getCircleRadandCenter(_circle));
        } catch (_error) {
          console.log("circlecomplete handler error", _error);
        }
      });
    } catch (_error) {
      console.log("DrawPolyShape circleCompleteEventListener error: ", _error);
    }
  }

  var polylineCompleteEventListener = () => {
    try {
      google.maps.event.addListener(this.drawingManager, "polylinecomplete", _polyline => {
        try {
          this.shapesHistoryArr.push(_polyline);
          this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CURSOR);

          //handle polyline movement
          google.maps.event.addListener(_polyline.getPath(), "set_at", () => getShapeCoords(_polyline));
          google.maps.event.addListener(_polyline.getPath(), "insert_at", () => getShapeCoords(_polyline));

          //get coordinates data
          getShapeCoords(_polyline);
        } catch (_polyline) {
          console.log("polylinecomplete handler error ", _error);
        }
      });
    } catch (_error) {
      console.log("DrawPolyShape circleCompleteEventListener error: ", _error);
    }
  }

  var polygonCompleteEventListener = () => {
    try {
      google.maps.event.addListener(this.drawingManager, "polygoncomplete", _polygon => {
        try {
          this.shapesHistoryArr.push(_polygon);
          this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CURSOR);
          //handle polyline movement
          google.maps.event.addListener(_polygon.getPath(), "set_at", () => getShapeCoords(_polygon));
          google.maps.event.addListener(_polygon.getPath(), "insert_at", () => getShapeCoords(_polygon));

          //get coordinates data
          getShapeCoords(_polygon);
        } catch (_error) {
          console.log("polygoncomplete handler error ", _error);
        }
      });
    } catch (_error) {
      console.log("DrawPolyShape circleCompleteEventListener error: ", _error);
    }
  }
}

function getCircleRadandCenter(_circle) {
  try {
    var center = _circle.getCenter();
    var radius = _circle.getRadius();
    console.log("Circle center: " + center, "Radius: " + radius);
  } catch (_error) {
    console.log("getCircleRadandCenter error: ", _error);
  }
}

function getShapeCoords(_shape) {
  try {
    var coords = _shape.getPath().getArray().toString();
    console.log(coords);
  } catch (_error) {
    console.log("getShapeCoords error: ", _error);
  }
}
