"use strict";
exports.__esModule = true;
var Field = (function () {
    function Field(field) {
        if (field === void 0) { field = {}; }
        this.gameType = field.gameType || 'Singles';
        this.terrain = field.terrain;
        this.weather = field.weather;
        this.isGravity = !!field.isGravity;
        this.attackerSide = new Side(field.attackerSide || {});
        this.defenderSide = new Side(field.defenderSide || {});
    }
    Field.prototype.hasWeather = function () {
        var weathers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            weathers[_i] = arguments[_i];
        }
        return this.weather && weathers.indexOf(this.weather) !== -1;
    };
    Field.prototype.swap = function () {
        var _a;
        _a = [this.defenderSide, this.attackerSide], this.attackerSide = _a[0], this.defenderSide = _a[1];
        return this;
    };
    Field.prototype.clone = function () {
        return new Field({
            gameType: this.gameType,
            weather: this.weather,
            terrain: this.terrain,
            isGravity: this.isGravity,
            attackerSide: this.attackerSide,
            defenderSide: this.defenderSide
        });
    };
    return Field;
}());
exports.Field = Field;
var Side = (function () {
    function Side(side) {
        this.spikes = side.spikes || 0;
        this.isSR = !!side.isSR;
        this.steelsurge = !!side.steelsurge;
        this.isReflect = !!side.isReflect;
        this.isLightScreen = !!side.isLightScreen;
        this.isProtected = !!side.isProtected;
        this.isSeeded = !!side.isSeeded;
        this.isForesight = !!side.isForesight;
        this.isTailwind = !!side.isTailwind;
        this.isHelpingHand = !!side.isHelpingHand;
        this.isFriendGuard = !!side.isFriendGuard;
        this.isAuroraVeil = !!side.isAuroraVeil;
        this.isBattery = !!side.isBattery;
    }
    Side.prototype.clone = function () {
        return new Side(this);
    };
    return Side;
}());
exports.Side = Side;
