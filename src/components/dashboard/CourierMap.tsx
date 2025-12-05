'use client';

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

// Icon Gudang (Custom)
const warehouseIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/484/484660.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});

const defaultIcon = new L.Icon({
    iconUrl: iconUrl,
    iconRetinaUrl: iconRetinaUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 13);
    }, [center, map]);
    return null;
}

interface CourierMapProps {
    routeCoords: [number, number][]; 
    startPoint: [number, number];
    endPoint: [number, number];
}

export default function CourierMap({ routeCoords, startPoint, endPoint }: CourierMapProps) {
    return (
        <MapContainer center={startPoint} zoom={13} style={{ height: '100%', width: '100%', borderRadius: '1.5rem' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapUpdater center={endPoint} />

            {/* Marker Gudang */}
            <Marker position={startPoint} icon={warehouseIcon}>
                <Popup>Gudang Pusat (Hub)</Popup>
            </Marker>

            {/* Marker Tujuan */}
            <Marker position={endPoint} icon={defaultIcon}>
                <Popup>Lokasi Pelanggan</Popup>
            </Marker>

            {/* Garis Jalur (Polyline) */}
            {routeCoords.length > 0 && (
                <Polyline
                    positions={routeCoords}
                    pathOptions={{ color: '#10b981', weight: 6, opacity: 0.8 }}
                />
            )}
        </MapContainer>
    );
}