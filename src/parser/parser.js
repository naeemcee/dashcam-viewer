import JSZip from "jszip";
import { GPSPoint } from "../models/GPSPoint.js";
import { Trip } from "../models/Trip.js";

export class GPSParser {

    async loadZip(file) {
        const zip = await JSZip.loadAsync(file);
        const gpsFiles = [];

        zip.forEach((path, entry) => {
            if(path.toLowerCase().endsWith(".txt"))
                gpsFiles.push(entry);
        });

        const allPoints = [];

        for(const file of gpsFiles){
            const text = await file.async("string");
            const points = this.parseText(text);
            allPoints.push(...points);
        }

        allPoints.sort((a,b)=>a.timestamp-b.timestamp);
        // return allPoints;

        return new Trip(allPoints);
    }



parseLine(line) {
    // const regex = /(\d{4}\/\d{2}\/\d{2})\s+(\d{2}:\d{2}:\d{2}).*?N:([0-9.]+).*?E:([0-9.]+)/;
    // const regex = /^(\d{4}\/\d{2}\/\d{2})\s+(\d{2}:\d{2}:\d{2})\s+N:([+-]?\d+(?:\.\d+)?)\s+E:([+-]?\d+(?:\.\d+)?)\s+([+-]?\d+(?:\.\d+)?)\s+km\/h/i;

    const regex = /^(\d{4}\/\d{2}\/\d{2})\s+(\d{2}:\d{2}:\d{2})\s+N:([+-]?\d+(?:\.\d+)?)\s+E:([+-]?\d+(?:\.\d+)?)\s+([+-]?\d+(?:\.\d+)?)\s+km\/h\s+([+-]?\d+(?:\.\d+)?)\s+([+-]?\d+(?:\.\d+)?)\s+(\d+)\s+x:([+-]?\d+(?:\.\d+)?)\s+y:([+-]?\d+(?:\.\d+)?)\s+z:([+-]?\d+(?:\.\d+)?)/i;

    const match = line.match(regex);

    if (!match) {
        return null;
    }

    return new GPSPoint(

        // 1 + 2: timestamp
        new Date(`${match[1]} ${match[2]}`),

        // 3: latitude
        Number(match[3]),

        // 4: longitude
        Number(match[4]),

        // 5: speed
        Number(match[5]),

        // 6: heading
        Number(match[6]),

        // 7: altitude
        Number(match[7]),

        // 8: satellites
        Number(match[8]),

        // 9: acceleration X
        Number(match[9]),

        // 10: acceleration Y
        Number(match[10]),

        // 11: acceleration Z
        Number(match[11])
    );

    // return {
    //     timestamp: new Date(match[1]+" "+match[2]),
    //     lat: Number(match[3]),
    //     lon: Number(match[4])
    // };

    // return new GPSPoint(
        // new Date(match[1] + " " + match[2]),
    //     new Date(`${match[1]} ${match[2]}`),
    //     Number(match[3]),
    //     Number(match[4]),
    //     Number(match[5])
    // );
}


    parseText(text){
        const points = [];
        const lines = text.split(/\r?\n/);

        for(const line of lines){
            const point = this.parseLine(line);
            if(point)
                points.push(point);
        }

        return points;
    }

}