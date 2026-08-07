import { MapManager } from "./map/map.js";
import { GPSParser } from "./parser/parser.js";
import { TripAnalyzer } from "./analytics/TripAnalyzer.js";
import { Dashboard } from "./ui/dashboard.js";

export class App {

    constructor() {
        this.map = null;
        this.parser = null;
        this.analyzer = null;
        this.zipInput = null;
        this.dashboard = null;
    }

    initialize() {
        this.map = new MapManager("map");
        this.map.initialize();
        this.parser = new GPSParser();
        this.analyzer = new TripAnalyzer();
        this.zipInput = document.getElementById("zipInput");
        this.registerEvents();
        this.dashboard = new Dashboard();
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
        
        const trip = await this.parser.loadZip(file);

        if (trip.isEmpty) {
            alert ("No GPS data found!");
            return;
        }

        const statistics = this.analyzer.analyze(trip);
        console.log("Trip statistics:", statistics);
        
        this.dashboard.update(statistics);

        this.map.displayTrip(trip);
        console.log(`Loaded ${trip.pointCount} GPS points`);

    }

}