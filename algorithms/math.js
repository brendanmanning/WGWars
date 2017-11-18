/**
 * Given an array of latitude and logitude values in array form ([[lat,long],[lat,long]]),
 * Compute the median/average point by taking the average latitude and the average longitude
 * @param {double[][]} points A 2d array of doubles [ [latitude, longitude], ...]
 * @returns {double[]} The average of all these coordinates [latitude, longitude]
 */
function midpoint(points) {
    var latitude = 0;
    var longitude = 0;

    for(point of points) {
        latitude += point[0];
        longitude += point[1];
    }

    latitude /= points.length;
    longitude /= points.length;

    return [latitude, longitude];
}

/**
 * Given two points in [latitude,longitude] form, return the distance between the two
 * @param {double[]} point1 The first point ( [latitude, longitude] form)
 * @param {double[]} point2 The second point ( [latitude, longitude] form)
 */
function distance(point1, point2) {

    var latdist = 0;
    var londist = 0;

    latdist = point1[0] - point2[0]
    londist = point1[1] - point2[1];

    return Math.sqrt( Math.pow(latdist, 2) + Math.pow(londist, 2) );
    
}

module.exports = { midpoint, distance };