import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./leafletIcons.js";

export class MapManager {
    constructor(containerId) {
        this.containerId = containerId;
        this.map = null;

        this.routeLayer = null;
        this.markerLayer = null;
    }

    initialize() {
        this.map = L.map(this.containerId, {
            zoomControl: true
        });

        this.map.setView([12.9716, 77.5946], 8);

        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 19,
                attribution: "&copy; OpenStreetMap contributors",
            }
        ).addTo(this.map);

        // Create reusable layers
        this.routeLayer = L.layerGroup().addTo(this.map);
        this.markerLayer = L.layerGroup().addTo(this.map);
    }

    drawRoute(points) {
        this.routeLayer.clearLayers();

        const route = L.polyline(points, {
            color: "blue",
            weight: 5
        });

        route.addTo(this.routeLayer);

        this.map.fitBounds(route.getBounds());
    }

    drawMarkers(start, end) {
        this.markerLayer.clearLayers();

        L.marker(start)
            .addTo(this.markerLayer)
            .bindPopup("Start");

        L.marker(end)
            .addTo(this.markerLayer)
            .bindPopup("Finish");
    }
}