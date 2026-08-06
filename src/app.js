import { MapManager } from "./map/map.js";
import { GPSParser } from "./parser/parser.js";

let map;
let parser;

export function initializeApp() {

    // Create the map
    map = new MapManager("map");
    map.initialize();

    // Create the parser
    parser = new GPSParser();

    // Get the ZIP file input
    const input = document.getElementById("zipInput");

    input.addEventListener("change", async (event) => {

        const file = event.target.files[0];

        if (!file) {
            return;
        }

        console.log("Loading:", file.name);

        try {

            // Parse all GPS points from the ZIP
            const points = await parser.loadZip(file);

            console.log(`Loaded ${points.length} GPS points`);

            if (points.length === 0) {
                alert("No GPS points found.");
                return;
            }

            // Convert to Leaflet coordinates
            const latLngs = points.map(point => [
                point.lat,
                point.lon
            ]);

            // Draw the route
            map.drawRoute(latLngs);

            // Draw the start and finish markers
            map.drawMarkers(
                latLngs[0],
                latLngs.at(-1)
            );

            console.log("Route drawn successfully.");

        }
        catch (error) {
            console.error(error);
            alert("Failed to load GPS ZIP.");
        }

    });

}





// const points = [
//         [11.866725671652453, 75.3597232044796],
//         [12.33452182943908, 76.59707449478721],
//         [12.950527616029861, 77.53740876846356],
//         [12.935592669674218, 77.53576492452174]
//     ];