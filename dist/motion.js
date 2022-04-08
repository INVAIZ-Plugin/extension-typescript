"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var main_1 = __importDefault(require("./main"));
var utils_1 = __importDefault(require("./utils"));
var motionEffect = {
    position: {
        index: 0,
        kr: '포지션',
        en: 'position'
    }
};
console.log(motionEffect['position']);
var PrMotion = {
    modify: function (payload) {
        main_1["default"].excute(payload, 'Motion', PrMotion.calcNewValue);
    },
    calcNewValue: function (params) {
        var value = params.value, diff = params.diff, propsIndex = params.propsIndex;
        if (propsIndex && Array.isArray(value)) {
            var seqFrame = utils_1["default"].getSequenceFrame();
            var standard = propsIndex === 0 ? seqFrame.width : seqFrame.height;
            var newValue = standard * value[propsIndex] + diff * (Math.abs(diff) * 1.7);
            value[propsIndex] = newValue / standard;
            return value;
        }
        else if (typeof value === 'number') {
            var newValue = value + diff * Math.abs(diff);
            return newValue;
        }
    }
};
