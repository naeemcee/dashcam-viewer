import { MapManager } from "./map/map.js";
import { GPSParser } from "./parser/parser.js";

export class App {

    constructor() {
        this.map = null;
        this.parser = null;
        this.zipInput = null;
    }

    initialize() {
        this.map = new MapManager("map");
        this.map.initialize();
        this.parser = new GPSParser();
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
        
        const trip = await this.parser.loadZip(file);

        if (trip.isEmpty) {
            alert ("No GPS data found!");
            return;
        }

        this.map.displayTrip(trip);
        console.log(`Loaded ${trip.pointCount} GPS points`);

    }

}