function initMap() {
  try {
    let center = { lat: 32.109333, lng: 34.855499 };
    let map = new google.maps.Map(document.getElementById("map"), {
      center: new google.maps.LatLng(center),
      disableDefaultUI: true,
      clickableIcons: false,
      zoom: 11
    });

    //hold references to all drawn shapes
    var allShapes = [];

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
        google.maps.event.clearListeners(map, "click");
        drawPolyline(map, allShapes);
      };

      drawCircleButton.onclick = function(_e) {
        google.maps.event.clearListeners(map, "click");
        drawCircle(map, allShapes);
      };

      drawPolyGonButton.onclick = function(_e) {
        google.maps.event.clearListeners(map, "click");
        drawPolygon(map, allShapes);
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

function drawPolygon(_map, _allShapes) {
  try {
    let addFirstCoordForPolyHandler = google.maps.event.addListener(
      _map,
      "click",
      addPolygon
    );

    function addPolygon(_e) {
      let center = { lat: _e.latLng.lat(), lng: _e.latLng.lng() };
      let destinations = new google.maps.MVCArray();
      destinations.push(new google.maps.LatLng(center));
      //define a polygon
      let polygon = new google.maps.Polygon({
        paths: destinations,
        draggable: true,
        editable: true,
        strokeOpacity: 0.8,
        fillColor: "#1E90FF",
        fillOpacity: 0.35
      });

      //keep reference to polygon
      _allShapes.push(polygon);

      //remove previous 'click' handler before assigning new one
      google.maps.event.removeListener(addFirstCoordForPolyHandler);
      google.maps.event.addListener(_map, "click", addCoords);
      function addCoords(_e) {
        try {
          let currentPath = polygon.getPath();
          currentPath.push(_e.latLng);
        } catch (error) {
          console.log("addCoords error: " + error);
        }
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

      //calculate polygon coordinates
      function getPolygonCoords() {
        let coords = polygon.getPath().b.map(coord => coord.toUrlValue());
        console.log(coords);
      }

      //set polygon on map
      polygon.setMap(_map);
    }
  } catch (error) {
    consoloe.log("drawPolygon error: " + error);
  }
}

function drawPolyline(_map, _allShapes) {
  try {
    //define a polyline
    let polyline = new google.maps.Polyline({
      strokeColor: "#FF0000"
    });

    //keep reference to polyline
    _allShapes.push(polyline);

    //handle click events on map \ add more polylines
    google.maps.event.addListener(_map, "click", addCoords);
    function addCoords(_e) {
      let currentPath = polyline.getPath();
      currentPath.push(_e.latLng);
    }

    //handle polyline user changes: dragging \ resizing \ adding coords
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

    //calcualte polyline coordinates
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

function drawCircle(_map, _allShapes) {
  try {
    let newCircleListener = google.maps.event.addListener(_map, "click", addCircle);

    function addCircle(_e) {
      let circle = new google.maps.Circle({
        center: _e.latLng,
        radius: _map.getZoom() * 500,
        fillColor: "#1E90FF",
        draggable: true,
        editable: true,
        map: _map
      });

      //keep reference to circle
      _allShapes.push(circle);

      google.maps.event.addListener(circle, "radius_changed", () => getCircleRadiusAndCenter(circle)); //update coordinates after resizing the circle
      google.maps.event.addListener(circle, "dragend", () => getCircleRadiusAndCenter(circle)); //update coordinates after dragging the circle

      getCircleRadiusAndCenter(circle) //update coordinates for the first time (when the circle just drawn)
      circle.setMap(_map);
    }
    //calculate circles coordinates
    function getCircleRadiusAndCenter(_circle) {
      try {
        console.log('center: ' + _circle.getCenter(), 'radius: ' + _circle.getRadius());         
      } catch (error) {
        console.log('getCircleCoords error: ' + error);          
      }
    }    
  } catch (error) {
    console.log("drawCircle error: " + error);
  }
}
