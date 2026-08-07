export class GPSPoint {

    constructor (
        timestamp,
        latitude,
        longitude,
        speed = null,
        heading = null
    ) 
    
    {
        this.timestamp = timestamp;
        this.latitude = latitude;
        this.longitude = longitude;
        this.speed = speed;
        this.heading = heading;
    }

    get lat() {
        return this.latitude;
    }

    get lon() {
        return this.longitude;
    }

}