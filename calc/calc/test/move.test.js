"use strict";
exports.__esModule = true;
var move_1 = require("../move");
describe('Move', function () {
    test('clone', function () {
        var m = new move_1.Move(7, 'Blizzard', { useZ: true });
        expect(m.name).toBe('Subzero Slammer');
        expect(m.bp).toBe(185);
        var clone = m.clone();
        expect(clone.name).toBe('Subzero Slammer');
        expect(clone.bp).toBe(185);
    });
});
