import { MapContainer, TileLayer, Marker, Tooltip, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import islands from "../../data/islands";
import L from "leaflet";

function Map() {
  const cenLat = 14.637;
  const cenLng = 112.121;
  let zoom = 5;
  let size = 32;
  // Define the custom icon
  const customIcon = new L.divIcon({
    className: "marker",
    html: 
      `<svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="marker"
      >
        <path
          stroke="#fff"
          fill="#44aac3"
          d="M15.938 32S6 17.938 6 11.938C6 .125 15.938 0 15.938 0S26 .125 26 11.875C26 18.062 15.938 32 15.938 32zM16 6a4 4 0 100 8 4 4 0 000-8z"
        />
      </svg>`
    ,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
//     // popupAnchor: [0, -size],
    tooltipAnchor: [1, -size],
  });
  const markers = [];
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
            let tooltipContent = `${translatedKey}: ${item.nameVietnamese}`;
            markers.push(
              <Marker position={[item.latitude, item.longitude]} icon={customIcon}>
                <Popup>A</Popup>
                <Tooltip direction="top">{tooltipContent}</Tooltip>
              </Marker>
            );
          });
        });
      });
    });
  });
  return (
    <MapContainer center={[cenLat, cenLng]} zoom={zoom} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers}
    </MapContainer>
  );
}

// const customIcon = (size) =>
//   new L.divIcon({
//     className: "marker",
//     html: `
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         viewBox="0 0 32 32"
//         className="marker"
//       >
//         <path
//           stroke="#fff"
//           fill="#44aac3"
//           d="M15.938 32S6 17.938 6 11.938C6 .125 15.938 0 15.938 0S26 .125 26 11.875C26 18.062 15.938 32 15.938 32zM16 6a4 4 0 100 8 4 4 0 000-8z"
//         />
//       </svg>`,
//     iconSize: [size, size],
//     iconAnchor: [size / 2, size],
//     // popupAnchor: [0, -size],
//     tooltipAnchor: [1, -size],
//   });

const translationDict = {
  island: "Đảo",
  reef: "Đá",
  bank: "Bãi",
  sand: "Cồn",
  rock: "Hòn",
};

export default Map;
