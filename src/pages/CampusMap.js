import React from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './CampusMap.css';

// Fix Leaflet default marker icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom LeSAH‑green marker
const lesahIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const LOCATIONS = [
  { name: "CMP Building", lat: -29.449910, lng: 27.723278 },
  { name: "BTM Building", lat: -29.450034, lng: 27.722882 },
  { name: "ETF Building", lat: -29.450466, lng: 27.723440 },
  { name: "Admin Block", lat: -29.450790, lng: 27.722078 },
  { name: "FTF Building", lat: -29.450683, lng: 27.723733 },
  { name: "Netherlands Building", lat: -29.449562, lng: 27.723525 },
  { name: "Mzalas Building", lat: -29.448872, lng: 27.723857 },
  { name: "Gilbo Residence", lat: -29.447687, lng: 27.725292 },
  { name: "Mswati Residence", lat: -29.447111, lng: 27.725008 },
  { name: "Machabeng Playground", lat: -29.445699, lng: 27.725384 },
  { name: "'Masenati Residence", lat: -29.445422, lng: 27.726311 },
  { name: "Cida Residence", lat: -29.446902, lng: 27.726364 },
  { name: "Africa Male Residence", lat: -29.448154, lng: 27.726232 },
  { name: "Africa Female Residence", lat: -29.448583, lng: 27.726144 },
  { name: "Pius Residence", lat: -29.450822, lng: 27.724306 },
  { name: "Murthala Residence", lat: -29.447386, lng: 27.726385 },
  { name: "Law General Office", lat: -29.450243, lng: 27.722217 },
  { name: "Moshoeshoe Building", lat: -29.450356, lng: 27.722026 },
  { name: "Mofolo Library", lat: -29.450149, lng: 27.721505 },
];

// Center on the NUL campus
const CAMPUS_CENTER = { lat: -29.4485, lng: 27.724 };

export default function CampusMap() {
  return (
    <div className="campus-map-page">
      <div className="campus-map-container">
        <Link to="/student-zone" className="back-link">← Back to Student Zone</Link>
        <h1>🗺️ NUL Campus Map</h1>
        <p className="campus-subtitle">Find your way around the National University of Lesotho</p>

        <div className="map-wrapper">
          <MapContainer
            center={[CAMPUS_CENTER.lat, CAMPUS_CENTER.lng]}
            zoom={16}
            scrollWheelZoom={true}
            style={{ height: "500px", width: "100%", borderRadius: "1.5rem" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {LOCATIONS.map((loc, idx) => (
              <Marker key={idx} position={[loc.lat, loc.lng]} icon={lesahIcon}>
                <Popup>{loc.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="location-list">
          <h3>📍 Key Locations</h3>
          <div className="location-grid">
            {LOCATIONS.map((loc, idx) => (
              <div key={idx} className="location-card">
                <span className="location-icon">📍</span>
                <span>{loc.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}