"use strict";
exports.__esModule = true;
var types_1 = require("../data/types");
var stats_1 = require("../stats");
function isGrounded(pokemon, field) {
    return (field.isGravity ||
        (!pokemon.hasType('Flying') &&
            !pokemon.hasAbility('Levitate') &&
            !pokemon.hasItem('Air Balloon')));
}
exports.isGrounded = isGrounded;
function getModifiedStat(stat, mod, gen) {
    var boostTable = [1, 1.5, 2, 2.5, 3, 3.5, 4];
    if (gen && gen < 3) {
        if (mod >= 0) {
            stat = Math.floor(stat * boostTable[mod]);
        }
        else {
            var numerators = [100, 66, 50, 40, 33, 28, 25];
            stat = Math.floor((stat * numerators[-mod]) / 100);
        }
        return Math.min(999, Math.max(1, stat));
    }
    if (mod >= 0) {
        stat = Math.floor(stat * boostTable[mod]);
    }
    else {
        stat = Math.floor(stat / boostTable[-mod]);
    }
    return stat;
}
exports.getModifiedStat = getModifiedStat;
function getFinalSpeed(gen, pokemon, field, side) {
    var weather = field.weather || '';
    var terrain = field.terrain;
    var speed = getModifiedStat(pokemon.rawStats.spe, pokemon.boosts.spe, gen);
    if (pokemon.hasItem('Choice Scarf')) {
        speed = pokeRound(speed * 1.5);
    }
    else if (pokemon.hasItem('Macho Brace', 'Iron Ball')) {
        speed = pokeRound(speed / 2);
    }
    else if (pokemon.hasItem('Quick Powder') && pokemon.named('Ditto')) {
        speed *= 2;
    }
    if ((pokemon.hasAbility('Chlorophyll') && weather.indexOf('Sun') !== -1) ||
        (pokemon.hasAbility('Sand Rush') && weather === 'Sand') ||
        (pokemon.hasAbility('Swift Swim') && weather.indexOf('Rain') !== -1) ||
        (pokemon.hasAbility('Slush Rush') && weather === 'Hail')) {
        speed *= 2;
    }
    else if (pokemon.hasAbility('Quick Feet') && !pokemon.hasStatus('Healthy')) {
        speed = pokeRound(speed * 1.5);
    }
    else if (pokemon.hasAbility('Slow Start') && pokemon.abilityOn) {
        speed = pokeRound(speed / 2);
    }
    else if ((pokemon.hasAbility('Surge Surfer') && terrain === 'Electric') ||
        (pokemon.hasAbility('Unburden') && pokemon.abilityOn)) {
        speed *= 2;
    }
    if (side.isTailwind)
        speed *= 2;
    if (pokemon.hasStatus('Paralyzed') && !pokemon.hasAbility('Quick Feet')) {
        speed = pokeRound(speed * (gen < 7 ? 0.25 : 0.5));
    }
    if (gen <= 2)
        speed = Math.min(999, speed);
    return Math.max(1, speed);
}
exports.getFinalSpeed = getFinalSpeed;
function pokeRound(num) {
    return num % 1 > 0.5 ? Math.ceil(num) : Math.floor(num);
}
exports.pokeRound = pokeRound;
function getMoveEffectiveness(gen, move, type, isGhostRevealed, isGravity) {
    if (isGhostRevealed && type === 'Ghost' && ['Normal', 'Fighting'].indexOf(move.type) !== -1) {
        return 1;
    }
    else if (isGravity && type === 'Flying' && move.type === 'Ground') {
        return 1;
    }
    else if (move.name === 'Freeze-Dry' && type === 'Water') {
        return 2;
    }
    else if (move.name === 'Flying Press') {
        return types_1.TYPE_CHART[gen]['Fighting'][type] * types_1.TYPE_CHART[gen]['Flying'][type];
    }
    else {
        return types_1.TYPE_CHART[gen][move.type][type];
    }
}
exports.getMoveEffectiveness = getMoveEffectiveness;
function checkAirLock(pokemon, field) {
    if (pokemon.hasAbility('Air Lock', 'Cloud Nine')) {
        field.weather = undefined;
    }
}
exports.checkAirLock = checkAirLock;
function checkForecast(pokemon, weather) {
    if (pokemon.hasAbility('Forecast') && pokemon.named('Castform')) {
        switch (weather) {
            case 'Sun':
            case 'Harsh Sunshine':
                pokemon.type1 = 'Fire';
                break;
            case 'Rain':
            case 'Heavy Rain':
                pokemon.type1 = 'Water';
                break;
            case 'Hail':
                pokemon.type1 = 'Ice';
                break;
            default:
                pokemon.type1 = 'Normal';
        }
        pokemon.type2 = undefined;
    }
}
exports.checkForecast = checkForecast;
function checkKlutz(pokemon) {
    if (pokemon.hasAbility('Klutz')) {
        pokemon.item = '';
    }
}
exports.checkKlutz = checkKlutz;
function checkIntimidate(source, target) {
    if (source.ability === 'Intimidate' &&
        source.abilityOn &&
        !target.hasAbility('Clear Body', 'White Smoke', 'Hyper Cutter', 'Full Metal Body')) {
        if (target.hasAbility('Contrary', 'Defiant')) {
            target.boosts.atk = Math.min(6, target.boosts.atk + 1);
        }
        else if (target.hasAbility('Simple')) {
            target.boosts.atk = Math.max(-6, target.boosts.atk - 2);
        }
        else {
            target.boosts.atk = Math.max(-6, target.boosts.atk - 1);
        }
    }
}
exports.checkIntimidate = checkIntimidate;
function checkTerrify(source, target) {
    if (source.ability === 'Terrify' &&
        source.abilityOn &&
        !target.hasAbility('Clear Body', 'White Smoke', 'Full Metal Body')) {
        if (target.hasAbility('Contrary')) {
            target.boosts.spa = Math.min(6, target.boosts.spa + 1);
        }
        else if (target.hasAbility('Defiant')) {
            target.boosts.spa = Math.max(-6, target.boosts.spa - 1);
            target.boosts.atk = Math.min(6, target.boosts.atk + 2);
        }
        else if (target.hasAbility('Simple')) {
            target.boosts.spa = Math.max(-6, target.boosts.spa - 2);
        }
        else {
            target.boosts.spa = Math.max(-6, target.boosts.spa - 1);
        }
    }
}
exports.checkTerrify = checkTerrify;
function checkDownload(source, target) {
    if (source.hasAbility('Download')) {
        if (target.stats.spd <= target.stats.def) {
            source.boosts.spa = Math.min(6, source.boosts.spa + 1);
        }
        else {
            source.boosts.atk = Math.min(6, source.boosts.atk + 1);
        }
    }
}
exports.checkDownload = checkDownload;
function countBoosts(gen, boosts) {
    var sum = 0;
    for (var i = 1; i < stats_1.STATS[gen].length; i++) {
        var boost = boosts[stats_1.STATS[gen][i]];
        if (boost && boost > 0)
            sum += boost;
    }
    return sum;
}
exports.countBoosts = countBoosts;
