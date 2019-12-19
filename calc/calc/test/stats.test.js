"use strict";
exports.__esModule = true;
var stats_1 = require("../stats");
var util_1 = require("../mechanics/util");
describe('stats', function () {
    test('displayStat', function () {
        expect(stats_1.displayStat('hp')).toBe('HP');
        expect(stats_1.displayStat('atk')).toBe('Atk');
        expect(stats_1.displayStat('def')).toBe('Def');
        expect(stats_1.displayStat('spa')).toBe('SpA');
        expect(stats_1.displayStat('spd')).toBe('SpD');
        expect(stats_1.displayStat('spe')).toBe('Spe');
        expect(stats_1.displayStat('spc')).toBe('Spc');
    });
    test('calcStat', function () {
        var RBY = {
            hp: 403,
            atk: 298,
            def: 298,
            spa: 298,
            spd: 298,
            spc: 298,
            spe: 298
        };
        var ADV = { hp: 404, atk: 328, def: 299, spa: 269, spd: 299, spe: 299 };
        for (var gen = 1; gen <= 7; gen++) {
            for (var _i = 0, _a = stats_1.STATS[gen]; _i < _a.length; _i++) {
                var stat = _a[_i];
                var val = stats_1.calcStat(gen, stat, 100, 31, 252, 100, 'Adamant');
                expect(val).toBe(gen < 3 ? RBY[stat] : ADV[stat]);
            }
        }
        expect(stats_1.calcStat(7, 'hp', 1, 31, 252, 100, 'Jolly')).toBe(1);
        expect(stats_1.calcStat(7, 'atk', 100, 31, 252, 100)).toBe(299);
    });
    test('dvs', function () {
        for (var dv = 0; dv <= 15; dv++) {
            expect(stats_1.IVToDV(stats_1.DVToIV(dv))).toBe(dv);
        }
        expect(stats_1.getHPDV({
            atk: stats_1.DVToIV(15),
            def: stats_1.DVToIV(15),
            spc: stats_1.DVToIV(15),
            spe: stats_1.DVToIV(15)
        })).toBe(15);
        expect(stats_1.getHPDV({
            atk: stats_1.DVToIV(5),
            def: stats_1.DVToIV(15),
            spc: stats_1.DVToIV(13),
            spe: stats_1.DVToIV(13)
        })).toBe(15);
        expect(stats_1.getHPDV({
            atk: stats_1.DVToIV(15),
            def: stats_1.DVToIV(3),
            spc: stats_1.DVToIV(11),
            spe: stats_1.DVToIV(10)
        })).toBe(13);
    });
    test('gen 2 modifications', function () {
        expect(util_1.getModifiedStat(158, -1, 2)).toBe(104);
        expect(util_1.getModifiedStat(238, -1, 2)).toBe(157);
    });
});
