import { useEffect, useRef } from "react";
import {
  Map as LeafletMap,
  // Icon, Marker
} from "leaflet";
// import { FeatureLayer } from "esri-leaflet";
import { vectorBasemapLayer } from "esri-leaflet-vector";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import islands from "../../data/islands.js";

// import icon from "leaflet/dist/images/marker-icon.png";
// import iconShadow from "leaflet/dist/images/marker-shadow.png";

function Map() {
  // const mapRef = useRef<HTMLInputElement | null>(null);
  const mapRef = useRef(null);

  useEffect(() => {
    // debugger;
    const cenLat = 14.637;
    const cenLng = 112.121;
    let zoom = 5;
    let size = 32;
    const mapRefCurrent = mapRef.current;

    if (mapRefCurrent !== null) {
      // Create a dom node to place the map in, so that cleanup is easier.
      const domNode = document.createElement("div");
      mapRefCurrent.appendChild(domNode);

      // The default icon does not work due to webpack issues
      // let DefaultIcon = new Icon({
      //   iconUrl: icon,
      //   shadowUrl: iconShadow,
      //   iconAnchor: [12, 41],
      //   popupAnchor: [0, -41],
      // });
      // Marker.prototype.options.icon = DefaultIcon;

      const map = new LeafletMap(domNode);
      map.setView([cenLat, cenLng], zoom);

      // Add a basemap
      vectorBasemapLayer("ArcGIS:Topographic", {
        apiKey:
          "AAPK0706734f1b9e46e7aed650ce277d956ayzOG-l_CVTeo9XWC7bgtjiZPjqInA2ZDqaRO2fLy2YDLdfJATjg8_ZqZhFhqPs5A", // https://developers.arcgis.com
      }).addTo(map);

      // Define the custom icon
      const customIcon = new L.divIcon({
        className: "marker",
        html: `<svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="marker"
      >
        <path
          stroke="#fff"
          fill="#44aac3"
          d="M15.938 32S6 17.938 6 11.938C6 .125 15.938 0 15.938 0S26 .125 26 11.875C26 18.062 15.938 32 15.938 32zM16 6a4 4 0 100 8 4 4 0 000-8z"
        />
      </svg>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
        //     // popupAnchor: [0, -size],
        tooltipAnchor: [1, -size],
      });
      // const markers = [];
      islands.forEach((province) => {
        province.bodies.forEach((body) => {
          body.clusters.forEach((cluster) => {
            let entities = cluster.entities;
            console.log("Entities: ", entities);
            Object.keys(entities).forEach((key) => {
              entities[key].map((item) => {
                // Print the latitude and longitude
                console.log(
                  `${key}: Latitude: ${item.latitude}, Longitude: ${item.longitude}`
                );
                const translatedKey = translationDict[key] || key;
                let tooltipContent = `${translatedKey}: ${item.nameVietnamese} (${item.latitude} - ${item.longitude})`;
                const marker = L.marker([item.latitude, item.longitude], {
                  icon: customIcon,
                })
                  .bindTooltip(tooltipContent, { direction: "top" })
                  .addTo(map);
              });
            });
          });
        });
      });
    }

    return () => {
      if (mapRefCurrent) {
        mapRefCurrent.innerHTML = "";
      }
    };
  }, [mapRef]);

  return <div className="map" ref={mapRef}></div>;
}

const translationDict = {
  island: "Đảo",
  reef: "Đá",
  bank: "Bãi",
  sand: "Cồn",
  rock: "Hòn",
};

export default Map;
