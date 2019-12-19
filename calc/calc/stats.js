"use strict";
exports.__esModule = true;
var natures_1 = require("./data/natures");
var RBY = ['hp', 'atk', 'def', 'spc', 'spe'];
var GSC = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
var ADV = GSC;
var DPP = GSC;
var BW = GSC;
var XY = GSC;
var SM = GSC;
var SS = GSC;
exports.STATS = [[], RBY, GSC, ADV, DPP, BW, XY, SM, SS];
function displayStat(stat) {
    switch (stat) {
        case 'hp':
            return 'HP';
        case 'atk':
            return 'Atk';
        case 'def':
            return 'Def';
        case 'spa':
            return 'SpA';
        case 'spd':
            return 'SpD';
        case 'spe':
            return 'Spe';
        case 'spc':
            return 'Spc';
        default:
            throw new Error("unknown stat " + stat);
    }
}
exports.displayStat = displayStat;
function calcStatRBYFromDV(stat, base, dv, level) {
    if (stat === 'hp') {
        return Math.floor((((base + dv) * 2 + 63) * level) / 100) + level + 10;
    }
    else {
        return Math.floor((((base + dv) * 2 + 63) * level) / 100) + 5;
    }
}
function calcStatADV(stat, base, iv, ev, level, nature) {
    if (stat === 'hp') {
        return base === 1
            ? base
            : Math.floor(((base * 2 + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
    }
    else {
        var mods = nature ? natures_1.NATURES[nature] : [undefined, undefined];
        var n = void 0;
        if (mods) {
            n = mods[0] === stat ? 1.1 : mods[1] === stat ? 0.9 : 1;
        }
        else {
            n = 1;
        }
        return Math.floor((Math.floor(((base * 2 + iv + Math.floor(ev / 4)) * level) / 100) + 5) * n);
    }
}
function calcStatRBY(stat, base, iv, ev, level, nature) {
    return calcStatRBYFromDV(stat, base, IVToDV(iv), level);
}
function calcStat0(stat, base, iv, ev, level, nature) {
    return 0;
}
function getHPDV(ivs) {
    return ((IVToDV(ivs.atk) % 2) * 8 +
        (IVToDV(ivs.def) % 2) * 4 +
        (IVToDV(ivs.spe) % 2) * 2 +
        (IVToDV(ivs.spc) % 2));
}
exports.getHPDV = getHPDV;
function IVToDV(iv) {
    return Math.floor(iv / 2);
}
exports.IVToDV = IVToDV;
function DVToIV(dv) {
    return dv * 2 + 1;
}
exports.DVToIV = DVToIV;
function shortForm(stat) {
    switch (stat) {
        case 'hp':
            return 'hp';
        case 'atk':
            return 'at';
        case 'def':
            return 'df';
        case 'spa':
            return 'sa';
        case 'spd':
            return 'sd';
        case 'spe':
            return 'sp';
        case 'spc':
            return 'sl';
    }
}
exports.shortForm = shortForm;
var CALC_STAT = [
    calcStat0,
    calcStatRBY,
    calcStatRBY,
    calcStatADV,
    calcStatADV,
    calcStatADV,
    calcStatADV,
    calcStatADV,
    calcStatADV,
];
function calcStat(gen, stat, base, iv, ev, level, nature) {
    return CALC_STAT[gen](stat, base, iv, ev, level, nature);
}
exports.calcStat = calcStat;
