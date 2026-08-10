import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./leafletIcons.js";

export class MapManager {
    constructor(containerId) {
        this.containerId = containerId;
        this.map = null;

        this.routeLayer = null;
        this.markerLayer = null;

        this.speedSegments = null;
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


    displayTrip(trip) {
        if (trip.isEmpty) {
            return;
        }

        const latLngs = trip.points.map(point => [
            point.lat,
            point.lon
        ]);
        
        this.drawRoute(latLngs);

        this.drawMarkers(
            latLngs[0],
            latLngs.at(-1)
        );
    }


    drawRoute(points) {
        this.routeLayer.clearLayers();

        const route = L.polyline(points, {
            color: "#666",
            weight: 2,
            opacity: 0.5,
            smoothFactor: 1.5
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


    getSpeedColor(speedKmph) {

        if (!Number.isFinite(speedKmph)) {
            return "#808080";
        }

        if (speedKmph < 20) {
            return "#2ecc71";
        }

        if (speedKmph < 40) {
            return "#f1c40f";
        }

        if (speedKmph < 60) {
            return "#e67e22";
        }

        return "#e74c3c";
    }


    // drawSpeedColoredRoute(trip) {
        
    //     this.clearSpeedRoute();

    //     if (!trip || trip.points.length < 2) {
    //         return;
    //     }

    //     const segments = [];

    //     for (let i = 1; i < trip.points.length; i++) {

    //         const previous =
    //             trip.points[i - 1];

    //         const current =
    //             trip.points[i];

    //         const speed =
    //             Number.isFinite(current.speedKmph)
    //                 // ? current.speedKmph
    //                 ? (previous.speedKmph + current.speedKmph) / 2
    //                 : 0;

    //         const segment = L.polyline(
    //                 [
    //                     [previous.lat, previous.lon],
    //                     [current.lat, current.lon]
    //                 ],
    //                 {
    //                     color: this.getSpeedColor(speed),
    //                     weight: 5,
    //                     opacity: 0.9
    //                 }
    //         );

    //         segments.push(segment);
    //     }

    //     this.speedSegments = L.layerGroup(segments).addTo(this.map);

    //     this.addSpeedLegend();

    // }

    drawSpeedColoredRoute(trip) {

    this.clearSpeedRoute();

    if (!trip || trip.points.length < 2) {
        return;
    }

    const segments = [];

    let currentColor = null;
    let currentCoordinates = [];

    for (let i = 1; i < trip.points.length; i++) {

        const previous = trip.points[i - 1];
        const current = trip.points[i];

        const previousSpeed =
            Number.isFinite(previous.speedKmph)
                ? previous.speedKmph
                : null;

        const currentSpeed =
            Number.isFinite(current.speedKmph)
                ? current.speedKmph
                : null;

        let speed = null;

        if (
            previousSpeed !== null &&
            currentSpeed !== null
        ) {
            speed =
                (previousSpeed + currentSpeed) / 2;
        }
        else if (currentSpeed !== null) {
            speed = currentSpeed;
        }
        else if (previousSpeed !== null) {
            speed = previousSpeed;
        }

        const color =
            this.getSpeedColor(speed);

        const start = [
            previous.lat,
            previous.lon
        ];

        const end = [
            current.lat,
            current.lon
        ];

        /*
         * Start a new group when the
         * speed colour changes.
         */
        if (
            currentColor !== null &&
            color !== currentColor
        ) {

            if (currentCoordinates.length >= 2) {

                segments.push({
                    color: currentColor,
                    coordinates: currentCoordinates
                });
            }

            currentCoordinates = [
                start,
                end
            ];

        }
        else {

            if (currentCoordinates.length === 0) {

                currentCoordinates = [
                    start,
                    end
                ];

            }
            else {

                currentCoordinates.push(end);
            }
        }

        currentColor = color;
    }

    /*
     * Add final segment.
     */
    if (currentCoordinates.length >= 2) {

        segments.push({
            color: currentColor,
            coordinates: currentCoordinates
        });
    }

    /*
     * Create one Leaflet polyline per
     * colour run instead of one per GPS point.
     */
    const layers = segments.map(segment => {

        return L.polyline(
            segment.coordinates,
            {
                color: segment.color,
                weight: 5,
                opacity: 0.9
            }
        );
    });

    this.speedSegments =
        L.layerGroup(layers).addTo(this.map);

    this.addSpeedLegend();

    console.log(
        `GPS points: ${trip.points.length}`
    );

    console.log(
        `Speed route segments: ${segments.length}`
    );
}

    clearSpeedRoute() {
        if (this.speedSegments) {
            this.speedSegments.remove();
            this.speedSegments = null;
        }
    }


    addSpeedLegend() {

        if (this.speedLegend) {
            return;
        }

        const legend =
            L.control({
                position: "bottomright"
            });

        legend.onAdd = () => {

            const div =
                L.DomUtil.create(
                    "div",
                    "speed-legend"
                );

            div.innerHTML = `
                <strong>Speed</strong>

                <div>
                    <span class="legend-color"
                        style="background:#2ecc71">
                    </span>
                    &lt; 20 km/h
                </div>

                <div>
                    <span class="legend-color"
                        style="background:#f1c40f">
                    </span>
                    20–40 km/h
                </div>

                <div>
                    <span class="legend-color"
                        style="background:#e67e22">
                    </span>
                    40–60 km/h
                </div>

                <div>
                    <span class="legend-color"
                        style="background:#e74c3c">
                    </span>
                    60+ km/h
                </div>
            `;

            return div;
        };

        legend.addTo(this.map);

        this.speedLegend = legend;
    }


    displayStops(stops) {
        this.clearStops();

        if (!stops || stops.length === 0) {
            return;
        }

        this.stopMarkers = L.layerGroup().addTo(this.map);

        stops.forEach((stop, index) => {

            const marker =
                L.marker(
                    [
                        stop.start.lat,
                        stop.start.lon
                    ]
                );

            const durationMinutes =
                Math.round(
                    stop.durationSeconds / 60
                );

            marker.bindPopup(`
                <strong>Stop ${index + 1}</strong>
                <br>
                Duration: ${durationMinutes} min
                <br>
                Started:
                ${stop.start.timestamp.toLocaleTimeString()}
            `);

            marker.addTo(
                this.stopMarkers
            );
        });
    }


    clearStops() {

        if (this.stopMarkers) {
            this.stopMarkers.remove();
            this.stopMarkers = null;
        }
    }

    
}