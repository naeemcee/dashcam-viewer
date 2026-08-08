export class GPSCleaner {

    constructor(options = {}) {

        this.maxSpeedKmh = options.maxSpeedKmh ?? 180;
        this.maxTimeGapSeconds = options.maxTimeGapSeconds ?? 120;

    }

    clean(points) {

        if (!points || points.length < 2) {
            return points ?? [];
        }

        const cleaned = [points[0]];

        for (let i = 1; i < points.length; i++) {

            const previous = cleaned.at(-1);
            const current = points[i];

            const timeSeconds = (current.timestamp - previous.timestamp) / 1000;

            // Invalid or duplicate timestamp
            if (timeSeconds <= 0) {
                continue;
            }

            // Large recording gap
            if (timeSeconds > this.maxTimeGapSeconds) {
                cleaned.push(current);
                continue;
            }

            const speedKmh =
                this.calculateSpeed(
                    previous,
                    current,
                    timeSeconds
                );

            // Ignore physically impossible GPS jumps
            if (speedKmh > this.maxSpeedKmh) {
                console.warn(
                    "Ignoring GPS jump:",
                    previous,
                    current,
                    speedKmh
                );

                continue;
            }

            cleaned.push(current);
        }

        return cleaned;
    }

    calculateSpeed(previous, current, timeSeconds) {

        const R = 6371;

        const lat1 =
            this.toRadians(previous.lat);

        const lat2 =
            this.toRadians(current.lat);

        const deltaLat =
            this.toRadians(
                current.lat - previous.lat
            );

        const deltaLon =
            this.toRadians(
                current.lon - previous.lon
            );

        const a =
            Math.sin(deltaLat / 2) ** 2 +
            Math.cos(lat1) *
            Math.cos(lat2) *
            Math.sin(deltaLon / 2) ** 2;

        const c =
            2 * Math.atan2(
                Math.sqrt(a),
                Math.sqrt(1 - a)
            );

        const distanceKm = R * c;

        return distanceKm /
            (timeSeconds / 3600);
    }

    toRadians(degrees) {
        return degrees * Math.PI / 180;
    }

}