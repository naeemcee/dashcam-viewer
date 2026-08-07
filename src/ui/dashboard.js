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
                    ${statistics.averageSpeedKmh.toFixed(1)} km/h
                </span>
            </div>

            <div class="stat">
                <strong>Moving Average</strong>
                <span>
                    ${statistics.movingAverageSpeedKmh.toFixed(1)}
                    km/h
                </span>
            </div>

            <div class="stat">
                <strong>Maximum Speed</strong>
                <span>
                    ${statistics.maxSpeedKmh.toFixed(1)}
                    km/h
                </span>
            </div>

            <div class="stat">
                <strong>GPS Points</strong>
                <span>
                    ${statistics.pointCount.toLocaleString()}
                </span>
            </div>

        `;

    }

    formatDuration(seconds) {

        const hours =
            Math.floor(seconds / 3600);

        const minutes =
            Math.floor((seconds % 3600) / 60);

        const secs =
            Math.floor(seconds % 60);

        return `${hours}h ${minutes}m ${secs}s`;

    }

}