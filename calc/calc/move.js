"use strict";
exports.__esModule = true;
var moves_1 = require("./data/moves");
var util_1 = require("./util");
var Move = (function () {
    function Move(gen, name, options) {
        if (options === void 0) { options = {}; }
        this.originalName = name;
        var data = util_1.extend(true, { name: name }, moves_1.MOVES[gen][name], options.overrides);
        if (options.useMax && 'maxPower' in data) {
            var maxMoveName = moves_1.getMaxMoveName(data.type, options.species, !!(data.category === 'Status'));
            var maxMove = moves_1.MOVES[gen][maxMoveName];
            var maxMoveBasePower = function (move) {
                var movePower = 10;
                if (move.maxPower)
                    movePower = move.maxPower;
                if (!move.maxPower && move.category !== 'Status') {
                    if (!move.bp) {
                        movePower = 100;
                    }
                    else if (move.type === 'Fighting' || move.type === 'Poison') {
                        if (move.bp >= 150) {
                            movePower = 100;
                        }
                        else if (move.bp >= 110) {
                            movePower = 95;
                        }
                        else if (move.bp >= 75) {
                            movePower = 90;
                        }
                        else if (move.bp >= 65) {
                            movePower = 85;
                        }
                        else if (move.bp >= 55) {
                            movePower = 80;
                        }
                        else if (move.bp >= 45) {
                            movePower = 75;
                        }
                        else {
                            movePower = 70;
                        }
                    }
                    else {
                        if (move.bp >= 150) {
                            movePower = 150;
                        }
                        else if (move.bp >= 110) {
                            movePower = 140;
                        }
                        else if (move.bp >= 75) {
                            movePower = 130;
                        }
                        else if (move.bp >= 65) {
                            movePower = 120;
                        }
                        else if (move.bp >= 55) {
                            movePower = 110;
                        }
                        else if (move.bp >= 45) {
                            movePower = 100;
                        }
                        else {
                            movePower = 90;
                        }
                    }
                }
                return movePower;
            };
            data = util_1.extend(true, {}, maxMove, {
                name: maxMoveName,
                bp: maxMove.bp === 10 ? maxMoveBasePower(data) : maxMove.bp,
                category: data.category
            });
            this.hits = 1;
        }
        if (options.useZ && 'zp' in data) {
            var zMoveName = moves_1.getZMoveName(data.name, data.type, options.item);
            var zMove = moves_1.MOVES[gen][zMoveName];
            data = util_1.extend(true, {}, zMove, {
                name: zMoveName,
                bp: zMove.bp === 1 ? data.zp : zMove.bp,
                category: data.category
            });
            this.hits = 1;
        }
        else {
            this.hits = data.isMultiHit
                ? options.hits || (options.ability === 'Skill Link' || options.item === 'Grip Claw' ? 5 : 3)
                : data.isTwoHit
                    ? 2
                    : 1;
            this.metronomeCount = options.metronomeCount;
        }
        this.usedTimes = (data.dropsStats && options.usedTimes) || 1;
        this.gen = gen;
        this.name = data.name;
        this.ability = options.ability;
        this.item = options.item;
        this.useZ = options.useZ;
        this.useMax = options.useMax;
        this.overrides = options.overrides;
        this.bp = data.bp;
        this.type = data.type;
        this.category = data.category || 'Status';
        this.hasSecondaryEffect = !!data.hasSecondaryEffect;
        this.isSpread = data.isSpread === 'allAdjacent' ? data.isSpread : !!data.isSpread;
        this.makesContact = !!data.makesContact;
        this.hasRecoil = data.hasRecoil;
        this.isCrit = !!options.isCrit || !!data.alwaysCrit;
        this.givesHealth = !!data.givesHealth;
        this.percentHealed = data.percentHealed;
        this.ignoresBurn = !!data.ignoresBurn;
        this.isPunch = !!data.isPunch;
        this.isBite = !!data.isBite;
        this.isBullet = !!data.isBullet;
        this.isSound = !!data.isSound;
        this.isPulse = !!data.isPulse;
        this.hasPriority = !!data.hasPriority;
        this.dropsStats = data.dropsStats;
        this.ignoresDefenseBoosts = !!data.ignoresDefenseBoosts;
        this.dealsPhysicalDamage = !!data.dealsPhysicalDamage;
        this.bypassesProtect = !!data.bypassesProtect;
        this.isZ = !!data.isZ;
        this.isMax = !!data.isMax;
        this.usesHighestAttackStat = !!data.usesHighestAttackStat;
    }
    Move.prototype.clone = function () {
        return new Move(this.gen, this.originalName, {
            ability: this.ability,
            item: this.item,
            species: this.species,
            useZ: this.useZ,
            useMax: this.useMax,
            isCrit: this.isCrit,
            hits: this.hits,
            usedTimes: this.usedTimes,
            metronomeCount: this.metronomeCount,
            overrides: this.overrides
        });
    };
    return Move;
}());
exports.Move = Move;
