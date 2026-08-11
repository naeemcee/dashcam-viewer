export class TripInfoPanel {

    constructor(containerId) {

        this.container =
            document.getElementById(containerId);

        if (!this.container) {
            throw new Error(
                `Trip info container "${containerId}" not found.`
            );
        }
    }

    showPoint(point) {

        if (!point) {
            this.clear();
            return;
        }

        const speed =
            Number.isFinite(point.speedKmph)
                ? `${point.speedKmph.toFixed(1)} km/h`
                : "--";

        const heading =
            Number.isFinite(point.headingDegrees)
                ? `${point.headingDegrees.toFixed(1)}°`
                : "--";

        const altitude =
            Number.isFinite(point.altitudeMeters)
                ? `${point.altitudeMeters.toFixed(1)} m`
                : "--";

        const satellites =
            Number.isFinite(point.satelliteCount)
                ? point.satelliteCount
                : "--";

        const accelerationX =
            Number.isFinite(point.accelerationX)
                ? point.accelerationX.toFixed(2)
                : "--";

        const accelerationY =
            Number.isFinite(point.accelerationY)
                ? point.accelerationY.toFixed(2)
                : "--";

        const accelerationZ =
            Number.isFinite(point.accelerationZ)
                ? point.accelerationZ.toFixed(2)
                : "--";

        this.container.innerHTML = `
            <div class="trip-info">

                <h3>GPS Point</h3>

                <div class="info-row">
                    <span>Time</span>
                    <strong>
                        ${point.timestamp.toLocaleString()}
                    </strong>
                </div>

                <div class="info-row">
                    <span>Speed</span>
                    <strong>${speed}</strong>
                </div>

                <div class="info-row">
                    <span>Heading</span>
                    <strong>${heading}</strong>
                </div>

                <div class="info-row">
                    <span>Altitude</span>
                    <strong>${altitude}</strong>
                </div>

                <div class="info-row">
                    <span>Satellites</span>
                    <strong>${satellites}</strong>
                </div>

                <h4>Acceleration</h4>

                <div class="info-row">
                    <span>X</span>
                    <strong>${accelerationX}</strong>
                </div>

                <div class="info-row">
                    <span>Y</span>
                    <strong>${accelerationY}</strong>
                </div>

                <div class="info-row">
                    <span>Z</span>
                    <strong>${accelerationZ}</strong>
                </div>

            </div>
        `;
    }

    clear() {

        this.container.innerHTML = `
            <h3>Trip Information</h3>
            <div class="trip-info-empty">
                Select a point on the route.
            </div>
        `;
    }
}