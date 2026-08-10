import { distance } from "@turf/turf";

export class TripAnalyzer {

    constructor(options = {}) {

        this.movingSpeedThreshold = options.movingSpeedThreshold ?? 3;
        this.maxTimeGapSeconds = options.maxTimeGapSeconds ?? 120;

    }

    analyze(trip) {

        if (trip.isEmpty) {
            return this.emptyStatistics();
        }

        const statistics = {
            pointCount: trip.pointCount,
            distanceKm: 0,
            durationSeconds: 0,
            movingTimeSeconds: 0,
            idleTimeSeconds: 0,
            averageSpeedKmph: 0,
            movingAverageSpeedKmph: 0,
            maxSpeedKmph: 0,
            elevationGainMeters: 0,
            elevationLossMeters: 0,
            minAltitudeMeters: null,
            maxAltitudeMeters: null,
            averageSatellites: 0,
            minSatellites: null
        };

        this.calculateDistance(
            trip,
            statistics
        );

        this.calculateDuration(
            trip,
            statistics
        );

        this.calculateSpeeds(
            trip,
            statistics
        );

        this.calculateElevation(
            trip,
            statistics
        );

        this.calculateGPSQuality(
            trip,
            statistics
        );

        return statistics;
    }

    calculateDistance(trip, statistics) {

        for (let i = 1; i < trip.points.length; i++) {

            const previous = trip.points[i - 1];
            const current = trip.points[i];

            const timeSeconds =
                (current.timestamp -
                    previous.timestamp) / 1000;

            if (timeSeconds <= 0) {
                continue;
            }

            if (
                timeSeconds >
                this.maxTimeGapSeconds
            ) {
                continue;
            }

            const segmentDistance =
                distance(
                    [previous.lon, previous.lat],
                    [current.lon, current.lat],
                    {
                        units: "kilometers"
                    }
                );

            statistics.distanceKm +=
                segmentDistance;
        }
    }

    calculateDuration(trip, statistics) {

        const start = trip.start.timestamp;

        const finish = trip.finish.timestamp;

        statistics.durationSeconds =
            Math.max(
                0,
                (finish - start) / 1000
            );
    }

    calculateSpeeds(trip, statistics) {

        let movingTime = 0;
        let movingDistance = 0;

        for (let i = 1; i < trip.points.length; i++) {

            const previous = trip.points[i - 1];
            const current = trip.points[i];

            const timeSeconds =
                (current.timestamp -
                    previous.timestamp) / 1000;

            if (timeSeconds <= 0) {
                continue;
            }

            if (
                timeSeconds >
                this.maxTimeGapSeconds
            ) {
                continue;
            }

            const segmentDistance =
                distance(
                    [previous.lon, previous.lat],
                    [current.lon, current.lat],
                    {
                        units: "kilometers"
                    }
                );

            const speedKmph =
                this.getPointSpeed(
                    previous,
                    current,
                    timeSeconds
                );

            if (speedKmph === null) {
                continue;
            }

            statistics.maxSpeedKmph =
                Math.max(
                    statistics.maxSpeedKmph,
                    speedKmph
                );

            if (
                speedKmph >=
                this.movingSpeedThreshold
            ) {

                movingTime +=
                    timeSeconds;

                movingDistance +=
                    segmentDistance;
            }
        }

        if (statistics.durationSeconds > 0) {

            statistics.averageSpeedKmph =
                statistics.distanceKm /
                (statistics.durationSeconds / 3600);
        }

        if (movingTime > 0) {

            statistics.movingAverageSpeedKmph =
                movingDistance /
                (movingTime / 3600);
        }

        statistics.movingTimeSeconds =
            movingTime;

        statistics.idleTimeSeconds =
            Math.max(
                0,
                statistics.durationSeconds -
                movingTime
            );
    }

    getPointSpeed(
        previous,
        current,
        timeSeconds
    ) {

        // Prefer dashcam-recorded speed
        if (
            current.speedKmph !== null &&
            Number.isFinite(current.speedKmph)
        ) {
            return current.speedKmph;
        }

        // Fallback to calculated GPS speed
        return this.calculateGPSSpeed(
            previous,
            current,
            timeSeconds
        );
    }

    calculateGPSSpeed(
        previous,
        current,
        timeSeconds
    ) {

        if (timeSeconds <= 0) {
            return null;
        }

        const segmentDistance =
            distance(
                [previous.lon, previous.lat],
                [current.lon, current.lat],
                {
                    units: "kilometers"
                }
            );

        return segmentDistance /
            (timeSeconds / 3600);
    }

    calculateElevation(trip, statistics) {

        const altitudes =
            trip.points
                .map(point => point.altitudeMeters)
                .filter(
                    altitude =>
                        Number.isFinite(altitude)
                );

        if (altitudes.length === 0) {
            return;
        }

        statistics.minAltitudeMeters =
            Math.min(...altitudes);

        statistics.maxAltitudeMeters =
            Math.max(...altitudes);

        for (let i = 1; i < trip.points.length; i++) {

            const previous =
                trip.points[i - 1];

            const current =
                trip.points[i];

            if (
                !Number.isFinite(
                    previous.altitudeMeters
                ) ||
                !Number.isFinite(
                    current.altitudeMeters
                )
            ) {
                continue;
            }

            const change =
                current.altitudeMeters -
                previous.altitudeMeters;

            if (change > 0) {

                statistics.elevationGainMeters +=
                    change;

            }
            else if (change < 0) {

                statistics.elevationLossMeters +=
                    Math.abs(change);

            }
        }
    }

    calculateGPSQuality(trip, statistics) {

        const satellites =
            trip.points
                .map(point => point.satelliteCount)
                .filter(
                    count =>
                        Number.isFinite(count)
                );

        if (satellites.length === 0) {
            return;
        }

        const total =
            satellites.reduce(
                (sum, count) => sum + count,
                0
            );

        statistics.averageSatellites =
            total / satellites.length;

        statistics.minSatellites =
            Math.min(...satellites);
    }

    emptyStatistics() {

        return {

            pointCount: 0,
            distanceKm: 0,
            durationSeconds: 0,
            movingTimeSeconds: 0,
            idleTimeSeconds: 0,
            averageSpeedKmph: 0,
            movingAverageSpeedKmph: 0,
            maxSpeedKmph: 0,
            elevationGainMeters: 0,
            elevationLossMeters: 0,
            minAltitudeMeters: null,
            maxAltitudeMeters: null,
            averageSatellites: 0,
            minSatellites: null
        };
    }
}