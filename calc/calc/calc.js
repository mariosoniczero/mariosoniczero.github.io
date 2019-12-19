"use strict";
exports.__esModule = true;
var field_1 = require("./field");
var gen1_1 = require("./mechanics/gen1");
var gen2_1 = require("./mechanics/gen2");
var gen3_1 = require("./mechanics/gen3");
var gen4_1 = require("./mechanics/gen4");
var gen5_1 = require("./mechanics/gen5");
var gen6_1 = require("./mechanics/gen6");
var gen7_1 = require("./mechanics/gen7");
var gen8_1 = require("./mechanics/gen8");
var MECHANICS = [
    function () { },
    gen1_1.calculateRBY,
    gen2_1.calculateGSC,
    gen3_1.calculateADV,
    gen4_1.calculateDPP,
    gen5_1.calculateBW,
    gen6_1.calculateXY,
    gen7_1.calculateSM,
    gen8_1.calculateSS,
];
function calculate(gen, attacker, defender, move, field) {
    return MECHANICS[gen](attacker.clone(), defender.clone(), move.clone(), field ? field.clone() : new field_1.Field());
}
exports.calculate = calculate;
