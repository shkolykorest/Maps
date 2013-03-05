 var mapCanvas,
          clusterer,
          infoWnd;

      function initalize() {

        // Creating a new map
        var mapDiv = document.getElementById("map_canvas");
        var mapCanvas = new google.maps.Map(mapDiv, {
          mapTypeId : google.maps.MapTypeId.ROADMAP,
          
          //To add a control, the container doesn't clear.
          noClear : true
        });

        // Add a control
        var selectDiv = document.getElementById("category_panel");
        mapCanvas.controls[google.maps.ControlPosition.TOP_LEFT].push(selectDiv);

        // Generate bunch markers
        var sw = new google.maps.LatLng(-19.448292,-152.012329);
        var ne = new google.maps.LatLng(76.150236,58.925171 );
        var bounds = new google.maps.LatLngBounds(sw, ne);
        mapCanvas.setCenter(bounds.getCenter());
        mapCanvas.setZoom(3);
        
        var lat, lng, category, json = [];
        var categories = ["one", "two", "three"];
        for (var i = 0; i < 300; i++) {
          lat = Math.random() * (ne.lat() - sw.lat()) + sw.lat();
          lng = Math.random() * (ne.lng() - sw.lng()) + sw.lng();
          category = categories[Math.floor(Math.random() * 3)];
          json.push({
            "title" : "random #" + i,
            "lat" : lat,
            "lng" : lng,
            "description" : "<strong>" + category + "</strong><br>random #" + i,
            "category" : category
          });
        }
        
        //Icon images for each category
        var categoryIcons = {
          "one" : "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=1%7CFF0000%7C000000",
          "two" : "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=2%7C00FFFF%7C000000",
          "three" : "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=3%7CFF00FF%7C000000"
        }


        // Creating a global infoWindow object that will be reused by all markers
        infoWnd = new google.maps.InfoWindow();

        // Marker Clusterer setup
        var mcOptions = {
          gridSize : 50,
          maxZoom : 15
        };
        clusterer = new MarkerClusterer(mapCanvas, [], mcOptions);

        // Hold all markers based on markers' category
        var markers = {};
        
        // Generating all markers
        for (var i = 0, length = json.length; i < length; i++) {
          var data = json[i],
              latLng = new google.maps.LatLng(data.lat, data.lng),
              category = data.category;

          if ( category in markers == false) {
            markers[category] = [];
          }

          // Creating a marker and putting it on the map
          var marker = createMarker({
            position : latLng,
            title : data.title,
            icon : categoryIcons[data.category],
            description : data.description
          });
          markers[category].push(marker);
        }

        //Re-calcurating all cluster markers when the category select is changed.
        var select = document.getElementById("category");
        google.maps.event.addDomListener(select, "change", function() {
          var selected = this.value;
          clusterer.clearMarkers();
          clusterer.addMarkers(markers[selected]);
        });
        google.maps.event.trigger(select, "change");
      }
      
      function createMarker(options) {
        var marker = new google.maps.Marker(options);
        
        google.maps.event.addListener(marker, "click", function(){
          infoWnd.setContent(options.description);
          infoWnd.open(mapCanvas, marker);
        });
        return marker;
      }
      
      google.maps.event.addDomListener(window, "load", initalize);