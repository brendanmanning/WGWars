var assert = require('assert');

describe('Round', function() {
    describe('#createRound', function() {
        it('should do the whole kit and kaboodle', function() {
            var { createRound } = require('../db/rounds.js');
            var { magicValues } = require('../constants.js');
            
            createRound(magicValues.game, 5);
        });
    });
});