import { MapManager } from "./map/map.js";
import { GPSParser } from "./parser/parser.js";
import { TripAnalyzer } from "./analytics/TripAnalyzer.js";
import { GPSCleaner } from "./analytics/GPSCleaner.js";
import { StopDetector } from "./analytics/StopDetector.js";
import { Dashboard } from "./ui/dashboard.js";

export class App {

    constructor() {
        this.map = null;
        this.parser = null;
        this.analyzer = null;

        this.cleaner = null;
        this.stopDetector = null;

        this.zipInput = null;
        this.dashboard = null;
    }

    initialize() {
        this.map = new MapManager("map");
        this.map.initialize();
        this.parser = new GPSParser();
        this.analyzer = new TripAnalyzer();
        this.cleaner = new GPSCleaner({
            maxSpeedKmh: 180,
            maxTimeGapSeconds: 120
        });

        this.stopDetector = new StopDetector({
            speedThresholdKmh: 3,
            minimumStopSeconds: 30
        });

        this.dashboard = new Dashboard();
        this.zipInput = document.getElementById("zipInput");
        this.registerEvents();
    }

    registerEvents() {
        this.zipInput.addEventListener(
            "change",
            this.handleZipSelected.bind(this)
        );
    }

    async handleZipSelected(event) {
        const file = event.target.files[0];
        if (!file)
            return;

        console.log(`Loading ${file.name}`);
        
        // const trip = await this.parser.loadZip(file);

        let trip = await this.parser.loadZip(file);
        console.log(`Loaded ${trip.pointCount} GPS points`);

        console.log("Sample GPS point: ", trip.points[0]);
        // console.table({
        //     timestamp: trip.points[0].timestamp,
        //     latitude: trip.points[0].latitude,
        //     longitude: trip.points[0].longitude,
        //     speedKmph: trip.points[0].speedKmph,
        //     headingDegrees: trip.points[0].headingDegrees,
        //     altitudeMeters: trip.points[0].altitudeMeters,
        //     satelliteCount: trip.points[0].satelliteCount,
        //     accelerationX: trip.points[0].accelerationX,
        //     accelerationY: trip.points[0].accelerationY,
        //     accelerationZ: trip.points[0].accelerationZ
        // });

        console.table(
            trip.points.slice(0, 10).map(point => ({
                time: point.timestamp,
                lat: point.lat,
                lon: point.lon,
                speed: point.speedKmph,
                heading: point.headingDegrees,
                altitude: point.altitudeMeters,
                satellites: point.satelliteCount
            }))
        );

        if (trip.isEmpty) {
            alert ("No GPS data found!");
            return;
        }

        const originalPointCount = trip.pointCount;
        const cleanedPoints = this.cleaner.clean(trip.points);
        trip.points = cleanedPoints;
        console.log(`GPS points cleanup: ${originalPointCount} → ${trip.pointCount}`);

        const statistics = this.analyzer.analyze(trip);
        console.log("Trip statistics:", statistics);

        const stops = this.stopDetector.detect(trip);
        console.log("Statistics:", statistics);
        
        console.log("Stops:", stops);
        // console.table(stops.map(stop => ({
        //         start: stop.start.timestamp,
        //         end: stop.end.timestamp,
        //         duration: Math.round(stop.durationSeconds / 60) + " min"
        //     }))
        // );
        
        this.dashboard.update(statistics);

        this.map.displayTrip(trip);

    }

}