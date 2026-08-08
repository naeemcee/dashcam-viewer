export class GPSPoint {

    constructor (
        timestamp,
        latitude,
        longitude,
        speedKmph = null,
        headingDegrees = null,
        altitudeMeters = null,
        satelliteCount = null,
        accelerationX = null,
        accelerationY = null,
        accelerationZ = null
    ) 
    
    {
        this.timestamp = timestamp;
        this.latitude = latitude;
        this.longitude = longitude;

        this.speedKmph = speedKmph;
        this.headingDegrees = headingDegrees;
        this.altitudeMeters = altitudeMeters;
        this.satelliteCount = satelliteCount;

        this.accelerationX = accelerationX;
        this.accelerationY = accelerationY;
        this.accelerationZ = accelerationZ;
    }

    get lat() {
        return this.latitude;
    }

    get lon() {
        return this.longitude;
    }

    get speed() {
        return this.speedKmph;
    }

    get heading() {
        return this.headingDegrees;
    }

    get altitude() {
        return this.altitudeMeters;
    }

}