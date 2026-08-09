export class Dashboard {

    constructor() {

        this.container =
            document.getElementById("statsContainer");

    }

    update(statistics) {

        this.container.innerHTML = `

            <div class="stat">
                <strong>Distance</strong>
                <span>
                    ${statistics.distanceKm.toFixed(2)} km
                </span>
            </div>

            <div class="stat">
                <strong>Duration</strong>
                <span>
                    ${this.formatDuration(
                        statistics.durationSeconds
                    )}
                </span>
            </div>

            <div class="stat">
                <strong>Average Speed</strong>
                <span>
                    ${this.formatSpeed(statistics.averageSpeedKmph)}
                </span>
            </div>

            <div class="stat">
                <strong>Moving Average</strong>
                <span>
                    ${this.formatSpeed(statistics.movingAverageSpeedKmph)}
                </span>
            </div>

            <div class="stat">
                <strong>Maximum Speed</strong>
                <span>
                    ${this.formatSpeed(statistics.maxSpeedKmph)}
                </span>
            </div>

            <div class="stat">
                <strong>GPS Points</strong>
                <span>
                    ${statistics.pointCount.toLocaleString()}
                </span>
            </div>
            <div class="stat">
                <strong>Elevation Gain</strong>
                <span>
                    ${statistics.elevationGainMeters.toFixed(0)} m
                </span>
            </div>

            <div class="stat">
                <strong>Elevation Loss</strong>
                <span>
                    ${statistics.elevationLossMeters.toFixed(0)} m
                </span>
            </div>

            <div class="stat">
                <strong>GPS Satellites</strong>
                <span>
                    ${statistics.averageSatellites.toFixed(1)}
                </span>
            </div>

            <div class="stat">
                <strong>Moving Time</strong>
                <span>
                    ${this.formatDuration(
                        statistics.movingTimeSeconds
                    )}
                </span>
            </div>

            <div class="stat">
                <strong>Stopped Time</strong>
                <span>
                    ${this.formatDuration(
                        statistics.idleTimeSeconds
                    )}
                </span>
            </div>

        `;

    }


    formatDuration(seconds) {

        if (!Number.isFinite(seconds)) {
            return "--";
        }

        const totalSeconds = Math.round(seconds);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const remainingSeconds = totalSeconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }

        if (minutes > 0) {
            return `${minutes}m ${remainingSeconds}s`;
        }

        return `${remainingSeconds}s`;
    }

    formatSpeed(speedKmh) {

        if (!Number.isFinite(speedKmh)) {
            return "--";
        }

        return `${speedKmh.toFixed(1)} km/h`;
    }

}