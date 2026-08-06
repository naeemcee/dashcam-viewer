import { MapManager } from "./map/map.js";

let map;

export function initializeApp() {
    map = new MapManager("map");
    map.initialize();

    // const points = [
    //     [12.9716,77.5946],
    //     [12.9352,77.6245],
    //     [12.9141,77.6387],
    //     [12.8902,77.6544]
    // ];

    const points = [
        [11.866725671652453, 75.3597232044796],
        [12.33452182943908, 76.59707449478721],
        [12.950527616029861, 77.53740876846356],
        [12.935592669674218, 77.53576492452174]
    ];

    map.drawRoute(points);
    map.drawMarkers(points[0], points.at(-1));
}

