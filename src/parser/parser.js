import JSZip from "jszip";

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
        return allPoints;
    }

    // async loadZip(file) {
    //     const zip = await JSZip.loadAsync(file);
    //     const gpsFiles = [];

    //     zip.forEach((path, entry) => {
    //         if(path.toLowerCase().endsWith(".txt"))
    //             gpsFiles.push(entry);
    //     });

    //     const contents = [];
    //     for(const file of gpsFiles){
    //         contents.push(await file.async("string"));
    //     }

    //     return contents;
    // }


parseLine(line) {
    const regex = /(\d{4}\/\d{2}\/\d{2})\s+(\d{2}:\d{2}:\d{2}).*?N:([0-9.]+).*?E:([0-9.]+)/;

    const match = line.match(regex);

    if(!match)
        return null;

    return {
        timestamp: new Date(match[1]+" "+match[2]),
        lat: Number(match[3]),
        lon: Number(match[4])
    };
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