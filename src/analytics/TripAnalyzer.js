import { distance } from "@turf/turf";

export class TripAnalyzer {

    constructor() {
        this.movingSpeedThreshold = 3; // km/h
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
            averageSpeedKmh: 0,
            movingAverageSpeedKmh: 0,
            maxSpeedKmh: 0
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

        return statistics;

    }

    calculateDistance(trip, statistics) {

        for (let i = 1; i < trip.points.length; i++) {

            const previous = trip.points[i - 1];
            const current = trip.points[i];

            const segmentDistance = distance(
                [previous.lon, previous.lat],
                [current.lon, current.lat],
                {
                    units: "kilometers"
                }
            );

            statistics.distanceKm += segmentDistance;

        }

    }

    calculateDuration(trip, statistics) {

        const start = trip.start.timestamp;
        const finish = trip.finish.timestamp;

        statistics.durationSeconds =
            (finish - start) / 1000;

    }

    calculateSpeeds(trip, statistics) {

        let totalMovingDistance = 0;
        let totalMovingTime = 0;

        for (let i = 1; i < trip.points.length; i++) {

            const previous = trip.points[i - 1];
            const current = trip.points[i];

            const timeSeconds =
                (current.timestamp - previous.timestamp) / 1000;

            if (timeSeconds <= 0) {
                continue;
            }

            const segmentDistance = distance(
                [previous.lon, previous.lat],
                [current.lon, current.lat],
                {
                    units: "kilometers"
                }
            );

            const speedKmh =
                segmentDistance / (timeSeconds / 3600);

            statistics.maxSpeedKmh =
                Math.max(
                    statistics.maxSpeedKmh,
                    speedKmh
                );

            if (speedKmh >= this.movingSpeedThreshold) {

                totalMovingDistance += segmentDistance;
                totalMovingTime += timeSeconds;

            }

        }

        if (statistics.durationSeconds > 0) {

            statistics.averageSpeedKmh =
                statistics.distanceKm /
                (statistics.durationSeconds / 3600);

        }

        if (totalMovingTime > 0) {

            statistics.movingAverageSpeedKmh =
                totalMovingDistance /
                (totalMovingTime / 3600);

        }

        statistics.movingTimeSeconds =
            totalMovingTime;

        statistics.idleTimeSeconds =
            Math.max(
                0,
                statistics.durationSeconds -
                totalMovingTime
            );

    }

    emptyStatistics() {

        return {
            pointCount: 0,
            distanceKm: 0,
            durationSeconds: 0,
            movingTimeSeconds: 0,
            idleTimeSeconds: 0,
            averageSpeedKmh: 0,
            movingAverageSpeedKmh: 0,
            maxSpeedKmh: 0
        };

    }

}