"use strict";
exports.__esModule = true;
var species_1 = require("./data/species");
var stats_1 = require("./stats");
var util_1 = require("./util");
var Pokemon = (function () {
    function Pokemon(gen, name, options) {
        if (options === void 0) { options = {}; }
        this.species = util_1.extend(true, {}, species_1.SPECIES[gen][name], options.overrides);
        this.gen = gen;
        this.name = name;
        this.type1 = this.species.t1;
        this.type2 = this.species.t2;
        this.weight = this.species.w;
        this.level = options.level || 100;
        this.gender = options.gender || this.species.gender || 'male';
        this.ability = options.ability || this.species.ab;
        this.abilityOn = !!options.abilityOn;
        this.item = options.item;
        this.nature = options.nature || 'Serious';
        this.ivs = Pokemon.withDefault(gen, options.ivs, 31);
        this.evs = Pokemon.withDefault(gen, options.evs, gen >= 3 ? 0 : 252);
        this.boosts = Pokemon.withDefault(gen, options.boosts, 0);
        if (gen < 3) {
            this.ivs.hp = stats_1.DVToIV(stats_1.getHPDV({
                atk: this.ivs.atk,
                def: this.ivs.def,
                spe: this.ivs.spe,
                spc: typeof this.ivs.spc === 'undefined' ? this.ivs.spa : this.ivs.spc
            }));
        }
        this.rawStats = {};
        this.stats = {};
        for (var _i = 0, _a = stats_1.STATS[gen]; _i < _a.length; _i++) {
            var stat = _a[_i];
            var val = this.calcStat(gen, stat);
            this.rawStats[stat] = val;
            this.stats[stat] = val;
        }
        this.curHP = options.curHP && options.curHP <= this.maxHP() ? options.curHP : this.maxHP();
        this.status = options.status || 'Healthy';
        this.toxicCounter = options.toxicCounter || 0;
        this.moves = options.moves || [];
    }
    Pokemon.prototype.maxHP = function () {
        return this.rawStats.hp;
    };
    Pokemon.prototype.hasAbility = function () {
        var abilities = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            abilities[_i] = arguments[_i];
        }
        return this.ability && abilities.indexOf(this.ability) !== -1;
    };
    Pokemon.prototype.hasItem = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        return this.item && items.indexOf(this.item) !== -1;
    };
    Pokemon.prototype.hasStatus = function () {
        var statuses = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            statuses[_i] = arguments[_i];
        }
        return statuses.indexOf(this.status) !== -1;
    };
    Pokemon.prototype.hasType = function () {
        var types = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            types[_i] = arguments[_i];
        }
        for (var _a = 0, types_1 = types; _a < types_1.length; _a++) {
            var type = types_1[_a];
            if (this.type1 === type || this.type2 === type)
                return true;
        }
        return false;
    };
    Pokemon.prototype.named = function () {
        var names = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            names[_i] = arguments[_i];
        }
        return names.indexOf(this.name) !== -1;
    };
    Pokemon.prototype.clone = function () {
        return new Pokemon(this.gen, this.name, {
            level: this.level,
            ability: this.ability,
            abilityOn: this.abilityOn,
            item: this.item,
            gender: this.gender,
            nature: this.nature,
            ivs: util_1.extend(true, {}, this.ivs),
            evs: util_1.extend(true, {}, this.evs),
            boosts: util_1.extend(true, {}, this.boosts),
            curHP: this.curHP,
            status: this.status,
            toxicCounter: this.toxicCounter,
            moves: this.moves.slice(),
            overrides: this.species
        });
    };
    Pokemon.prototype.calcStat = function (gen, stat) {
        return stats_1.calcStat(gen, stat, this.species.bs[stats_1.shortForm(stat)], this.ivs[stat], this.evs[stat], this.level, this.nature);
    };
    Pokemon.getForme = function (gen, speciesName, item, moveName) {
        var species = species_1.SPECIES[gen][speciesName];
        if (!species || !species.formes) {
            return speciesName;
        }
        var i = 0;
        if ((item &&
            ((item.indexOf('ite') !== -1 && item.indexOf('ite Y') === -1) ||
                (speciesName === 'Groudon' && item === 'Red Orb') ||
                (speciesName === 'Kyogre' && item === 'Blue Orb'))) ||
            (moveName && speciesName === 'Meloetta' && moveName === 'Relic Song') ||
            (speciesName === 'Rayquaza' && moveName === 'Dragon Ascent')) {
            i = 1;
        }
        else if (item && item.indexOf('ite Y') !== -1) {
            i = 2;
        }
        return species.formes[i];
    };
    Pokemon.withDefault = function (gen, current, val) {
        return util_1.extend(true, {}, { hp: val, atk: val, def: val, spe: val }, gen < 2 ? { spc: val } : { spa: val, spd: val }, current);
    };
    return Pokemon;
}());
exports.Pokemon = Pokemon;
