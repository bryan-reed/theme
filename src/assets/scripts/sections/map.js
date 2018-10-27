import $ from "jquery";
import sections from "@shopify/theme-sections";

//Google map config options
const config = {
  zoom: 14,
  styles: [
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#cacaca" }, { lightness: 17 }]
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [{ color: "#e1e1e1" }, { lightness: 20 }]
    },
    {
      featureType: "road.highway",
      elementType: "geometry.fill",
      stylers: [{ color: "#ffffff" }, { lightness: 17 }]
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#ffffff" }, { lightness: 29 }, { weight: 0.2 }]
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }, { lightness: 18 }]
    },
    {
      featureType: "road.local",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }, { lightness: 16 }]
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ color: "#e1e1e1" }, { lightness: 21 }]
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#bbbbbb" }, { lightness: 21 }]
    },
    {
      elementType: "labels.text.stroke",
      stylers: [{ visibility: "on" }, { color: "#ffffff" }, { lightness: 16 }]
    },
    {
      elementType: "labels.text.fill",
      stylers: [{ saturation: 36 }, { color: "#333333" }, { lightness: 40 }]
    },
    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#f2f2f2" }, { lightness: 19 }]
    },
    {
      featureType: "administrative",
      elementType: "geometry.fill",
      stylers: [{ color: "#fefefe" }, { lightness: 20 }]
    },
    {
      featureType: "administrative",
      elementType: "geometry.stroke",
      stylers: [{ color: "#fefefe" }, { lightness: 17 }, { weight: 1.2 }]
    }
  ]
};

let apiStatus = null;
let mapsToLoad = [];
let key = theme.mapKey ? theme.mapKey : "";
sections.register("map", {
  onLoad(e) {
    //Start here
    //Check if google api js has been loaded
    if (apiStatus === "loaded") {
      this.createMap();
    } else {
      mapsToLoad.push(this);

      if (apiStatus !== "loading") {
        apiStatus = "loading";
        if (typeof window.google === "undefined") {
          $.getScript("https://maps.googleapis.com/maps/api/js?key=" + key)
            .then(() => {
              apiStatus = "loaded";
              this.initAllMaps();
            })
            .fail(err => console.log(err));
        }
      }
    }
  },
  initAllMaps() {
    $.each(mapsToLoad, (index, instance) => {
      instance.createMap();
    });
  },
  createMap: function() {
    var $map = this.$container.find(".map-section__container");
    return geolocate($map)
      .then(results => {
        var mapOptions = {
          zoom: config.zoom,
          styles: config.styles,
          center: results[0].geometry.location,
          disableDefaultUI: true
        };
        console.log(mapOptions);

        var map = (this.map = new google.maps.Map($map[0], mapOptions));
        var center = (this.center = map.getCenter());
        var markerColor = $map.data("marker-color");

        var markerIcon = {
          path:
            "M57.7,0C25.8,0,0,25.8,0,57.7C0,89.5,50,170,57.7,170s57.7-80.5,57.7-112.3C115.3,25.8,89.5,0,57.7,0z M57.7,85 c-14.9,0-27-12.1-27-27c0-14.9,12.1-27,27-27c14.9,0,27,12.1,27,27C84.7,72.9,72.6,85,57.7,85z",
          fillColor: markerColor,
          fillOpacity: 0.9,
          scale: 0.2,
          strokeWeight: 0
        };

        //eslint-disable-next-line no-unused-vars
        var marker = new google.maps.Marker({
          map: map,
          position: map.getCenter(),
          icon: markerIcon
        });
        google.maps.event.addDomListener(
          window,
          "resize",
          debounce(function() {
            google.maps.event.trigger(map, "resize");
            map.setCenter(center);
          }, 250)
        );
      })
      .fail(status => {
        var errorMessage;

        switch (status) {
          case "ZERO_RESULTS":
            errorMessage = theme.strings.addressNoResults;
            break;
          case "OVER_QUERY_LIMIT":
            errorMessage = theme.strings.addressQueryLimit;
            break;
          default:
            errorMessage = theme.strings.addressError;
            break;
        }

        $map
          .parent()
          .addClass("page-width map-section--load-error")
          .html('<div class="errors text-center">' + errorMessage + "</div>");
      });
  },
  onSelect(e) {
    // console.log("SECTION SELECTED", e);
  },
  onBlockSelect(e) {},
  onBlockDeselect(e) {},
  /**
   * Event callback for Theme Editor `section:unload` event
   */
  onUnload(e) {
    // console.log("SECTION UNLOADED", e, this);
    this.$container.off(this.namespace);
  }
});
function geolocate($map) {
  var deferred = $.Deferred();
  var geocoder = new google.maps.Geocoder();
  var address = $map.data("address-setting");

  geocoder.geocode({ address: address }, (results, status) => {
    if (status !== google.maps.GeocoderStatus.OK) {
      deferred.reject(status);
    }

    deferred.resolve(results);
  });

  return deferred;
}
// Credit David Walsh (https://davidwalsh.name/javascript-debounce-function)

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
  var timeout;

  // This is the function that is actually executed when
  // the DOM event is triggered.
  return function executedFunction() {
    // Store the context of this and any
    // parameters passed to executedFunction
    var context = this;
    var args = arguments;

    // The function to be called after
    // the debounce time has elapsed
    var later = function() {
      // null timeout to indicate the debounce ended
      timeout = null;

      // Call function now if you did not on the leading end
      if (!immediate) func.apply(context, args);
    };

    // Determine if you should call the function
    // on the leading or trail end
    var callNow = immediate && !timeout;

    // This will reset the waiting every function execution.
    // This is the step that prevents the function from
    // being executed because it will never reach the
    // inside of the previous setTimeout
    clearTimeout(timeout);

    // Restart the debounce waiting period.
    // setTimeout returns a truthy value (it differs in web vs node)
    timeout = setTimeout(later, wait);

    // Call immediately if you're dong a leading
    // end execution
    if (callNow) func.apply(context, args);
  };
}
