"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var controller_1 = __importDefault(require("./controller"));
var utils_1 = __importDefault(require("./utils"));
var PrOpacity = {
    modify: function (props, diff) {
        controller_1["default"].modify(props, diff, 'Opacity', this.calcNewValue);
    },
    calcNewValue: function (obj) {
        var value = obj.value, diff = obj.diff;
        var newValue = value + diff * Math.abs(diff);
        return newValue;
    }
};
var PrMotion = {
    modify: function (props, diff, propsValueIndex) {
        controller_1["default"].modify(props, diff, 'Motion', this.calcNewValue, propsValueIndex);
    },
    calcNewValue: function (obj) {
        var value = obj.value, diff = obj.diff, propsValueIndex = obj.propsValueIndex;
        var newValue;
        if (propsValueIndex) {
            newValue = this.calcPositionValue(value, diff, propsValueIndex);
        }
        else {
            newValue = value + diff * Math.abs(diff);
        }
        return newValue;
    },
    calcPositionValue: function (value, diff, props) {
        var standard = props === 0 ? 640 : 320;
        var newValue = standard * value[props] + diff * (Math.abs(diff) * 1.7);
        value[props] = newValue / standard;
        return value;
    }
};
var PrLumetri = {
    modify: function (props, diff) {
        var version = controller_1["default"].getAppVersion();
        props += version >= 22 ? 2 : 0;
        controller_1["default"].modify(props, diff, 'Lumetri Color', this.calcLumetri);
    },
    calcLumetri: function (obj) {
        var value = obj.value, diff = obj.diff, props = obj.props;
        var version = parseInt(app.version.split('.')[0]);
        var newValue = value + diff * Math.abs(diff);
        var temp = version >= 22 ? 2 : 0;
        switch (props) {
            case 10 + temp:
            case 11 + temp:
                return utils_1["default"].minMax(newValue, -300, 300);
            default:
                return 0;
        }
    }
};
