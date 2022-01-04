"use strict";
exports.__esModule = true;
var PrUtils = {
    minMax: function (value, min, max) {
        if (value < min) {
            return min;
        }
        else if (value > max) {
            return max;
        }
        else {
            return value;
        }
    }
};
exports["default"] = PrUtils;
