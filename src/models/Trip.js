export class Trip {

    constructor(points = []) {
        this.points = points;
    }

    get start() {
        return this.points[0] ?? null;
    }

    get finish() {
        return this.points.at(-1) ?? null;
    }

    get pointCount() {
        return this.points.length;
    }

    get isEmpty() {
        return this.points.length === 0;
    }

    get bounds() {

        if (this.isEmpty) {
            return null;
        }

        const latitudes = this.points.map(point => point.lat);
        const longitudes = this.points.map(point => point.lon);

        return {
            minLat: Math.min(...latitudes),
            maxLat: Math.max(...latitudes),
            minLon: Math.min(...longitudes),
            maxLon: Math.max(...longitudes)
        };
    }

}