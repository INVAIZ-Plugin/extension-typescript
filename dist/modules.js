"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var main_1 = __importDefault(require("./main"));
var utils_1 = __importDefault(require("./utils"));
var PrOpacity = {
    modify: function (payload) {
        main_1["default"].excute(payload, 'Opacity', PrOpacity.calcNewValue);
    },
    calcNewValue: function (params) {
        var value = params.value, diff = params.diff;
        if (typeof value === 'number') {
            var newValue = value + diff * Math.abs(diff);
            return newValue;
        }
        else {
            return new Error('empty value');
        }
    }
};
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
var PrLumetri = {
    modify: function (payload) {
        var version = utils_1["default"].getAppVersion();
        var props = payload.props;
        var newProps = version >= 22 ? props + 2 : props;
        payload = __assign(__assign({}, payload), { props: newProps });
        main_1["default"].excute(payload, 'Lumetri Color', PrLumetri.calcNewValue);
    },
    calcNewValue: function (params) {
        var value = params.value, diff = params.diff, props = params.props;
        if (typeof value === 'number' && props) {
            var weight = PrLumetri.setWeight(props);
            var newValue = value + diff * Math.abs(diff) * weight;
            return PrLumetri.minMax(props, newValue);
        }
        else {
            return new Error('empty value');
        }
    },
    setWeight: function (props) {
        var version = utils_1["default"].getAppVersion();
        if ((props === 14 && version < 22) || (props === 16 && version >= 22)) {
            return 0.1;
        }
        else {
            return 1;
        }
    },
    minMax: function (props, value) {
        var version = utils_1["default"].getAppVersion();
        var num = version >= 22 ? 2 : 0;
        switch (props) {
            //hdr white
            case 7:
                return utils_1["default"].minMax(value, 100, 1000);
            //?????? , ??????
            case 10 + num:
            case 11 + num:
                return utils_1["default"].minMax(value, -300, 300);
            //??????
            case 14 + num:
                return utils_1["default"].minMax(value, -7, 7);
            //?????? ,?????? , ??????????????? ,??????, ??????
            case 15 + num:
            case 16 + num:
            case 17 + num:
            case 18 + num:
            case 19 + num:
                return utils_1["default"].minMax(value, -150, 150);
            //??????
            case 24 + num:
                return utils_1["default"].minMax(value, 0, 300);
            //Lumetri Creative
            //??????
            case 31 + num:
                return utils_1["default"].minMax(value, 0, 200);
            //????????? ??????
            case 33 + num:
                return utils_1["default"].minMax(value, 0, 150);
            //?????? ??????
            case 34 + num:
            case 35 + num:
                return utils_1["default"].minMax(value, -100, 100);
            // ??????
            case 36 + num:
                return utils_1["default"].minMax(value, 0, 300);
            // ?????? ??????
            case 38 + num:
                return utils_1["default"].minMax(value, -150, 150);
            // Lumetri ??????
            // hdr ??????
            case 45 + num:
                return utils_1["default"].minMax(value, 100, 10000);
            //hsl ??????
            // ????????? ??????
            case 88 + num:
                return utils_1["default"].minMax(value, 0, 100);
            // ??????
            case 89 + num:
                return utils_1["default"].minMax(value, 0, 1000);
            // ?????? ??????
            case 94 + num:
            case 95 + num:
                return utils_1["default"].minMax(value, -300, 300);
            // ??????
            case 96 + num:
                return utils_1["default"].minMax(value, -150, 150);
            // ??????
            case 97 + num:
                return utils_1["default"].minMax(value, -100, 100);
            // ??????
            case 98 + num:
                return utils_1["default"].minMax(value, 0, 300);
            // Lumetri ?????????
            // ???
            case 103 + num:
                return utils_1["default"].minMax(value, -5, 5);
            //?????????
            case 104 + num:
                return utils_1["default"].minMax(value, 0, 100);
            //?????????
            case 105 + num:
                return utils_1["default"].minMax(value, -100, 100);
            //??????
            case 106 + num:
                return utils_1["default"].minMax(value, 0, 100);
            default:
                return 0;
        }
    }
};
