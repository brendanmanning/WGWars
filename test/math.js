var assert = require('assert');

describe('Math', function() {
    describe('#midpoint', function() {
        it('should return the average of latitude and longitude values in an array', function() {

            const { midpoint } = require('../algorithms/math.js');

            var tc1 = [
                [75.125, 73.851],
                [72.998, 71.999],
                [77.745, 88.031]
            ];
            var midpoint1 = midpoint(tc1);
            assert.equal(midpoint1[0], 75.28933333333333);
            assert.equal(midpoint1[1], 77.96033333333334);

            var tc2 = [
                [-81.5, -92.8],
                [-79.2, -10.1],
                [-80.35, -51.45]
            ];
            var midpoint2 = midpoint(tc2);
            assert.equal(midpoint2[0], -80.35);
            assert.equal(midpoint2[1], -51.449999999999996);

            var tc3 = [
                [-76.3, 21.0],
                [2.10, -3.18],
                [-37.1, 8.91]
            ];
            var midpoint3 = midpoint(tc3);
            assert.equal(midpoint3[0], -37.1);
            assert.equal(midpoint3[1], 8.91);
        })
    });
    describe('#distance', function() {

        const { distance } = require('../algorithms/math.js');

        it('should return the distance between two points', function() {
            var tc1 = [
                [-2,1],
                [1,5]
            ];
            var tc2 = [
                [75.125, 73.851],
                [72.998, 71.999]
            ];
            var tc3 = [
                [-76.3, 21.0],
                [2.10, -3.18]
            ];

            var d1 = distance(tc1[0], tc1[1]);
            var d2 = distance(tc2[0], tc2[1]);
            var d3 = distance(tc3[0], tc3[1]);

            assert.equal(d1, 5);
            assert.equal(d2, 2.820289524144639);
            assert.equal(d3, 82.04408814777577);
        });
    })
});