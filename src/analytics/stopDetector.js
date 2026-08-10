export class StopDetector {

    constructor(options = {}) {

        this.speedThresholdKmph =
            options.speedThresholdKmph ?? 3;

        this.minimumStopSeconds =
            options.minimumStopSeconds ?? 30;

    }

    detect(trip) {

        const stops = [];

        if (trip.isEmpty) {
            return stops;
        }

        let stopStart = null;

        for (let i = 1; i < trip.points.length; i++) {

            const previous = trip.points[i - 1];
            const current = trip.points[i];

            const timeSeconds = (current.timestamp - previous.timestamp) / 1000;

            if (timeSeconds <= 0) {
                continue;
            }

            const speed = this.getPointSpeed(
                previous,
                current,
                timeSeconds
            );

            const stationary = speed <= this.speedThresholdKmph;

            if (stationary && stopStart === null) {
                stopStart = previous;
            }

            if (!stationary && stopStart !== null) {
                const stopEnd = previous;

                const durationSeconds =
                    (stopEnd.timestamp -
                        stopStart.timestamp) / 1000;

                if (durationSeconds >= this.minimumStopSeconds) {

                    stops.push({
                        start: stopStart,
                        end: stopEnd,
                        durationSeconds
                    });

                }

                stopStart = null;

            }

        }

        // Handle a stop continuing until the final point
        if (stopStart !== null) {

            const stopEnd = trip.finish;

            const durationSeconds = (stopEnd.timestamp - stopStart.timestamp) / 1000;

            if (durationSeconds >= this.minimumStopSeconds) {

                stops.push({
                    start: stopStart,
                    end: stopEnd,
                    durationSeconds
                });

            }

        }

        return stops;

    }

    getPointSpeed(previous, current, timeSeconds) {

        if (
            current.speedKmph !== null &&
            Number.isFinite(current.speedKmph)
        ) {
            return current.speedKmph;
        }

        return this.calculateGPSSpeed(
            previous,
            current,
            timeSeconds
        );
    }

    calculateGPSSpeed(previous, current, timeSeconds) {

        if (timeSeconds <= 0) {
            return null;
        }
        const R = 6371;

        const lat1 = this.toRadians(previous.lat);

        const lat2 = this.toRadians(current.lat);

        const deltaLat = this.toRadians(current.lat - previous.lat);

        const deltaLon = this.toRadians(current.lon - previous.lon);

        const a =
            Math.sin(deltaLat / 2) ** 2 +
            Math.cos(lat1) *
            Math.cos(lat2) *
            Math.sin(deltaLon / 2) ** 2;

        const c = 2 * Math.atan2 (Math.sqrt(a), Math.sqrt(1 - a));

        const distanceKm = R * c;

        return distanceKm / (timeSeconds / 3600);

        // return (
        //     R * c
        // ) / (timeSeconds / 3600);

    }

    toRadians(degrees) {
        return degrees * Math.PI / 180;
    }

}