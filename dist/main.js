"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var utils_1 = __importDefault(require("./utils"));
var PrController = {
    excute: function (payload, type, callback) {
        var props = payload.props, propsIndex = payload.propsIndex, diff = payload.diff;
        var _a = utils_1["default"].getClip(), clip = _a.clip, clipComponents = _a.clipComponents;
        if (clipComponents && clip) {
            var name_1 = clipComponents[0].displayName;
            var currentType = utils_1["default"].getDisplayName(name_1, type);
            for (var i = 0; i < (clipComponents === null || clipComponents === void 0 ? void 0 : clipComponents.numItems); i++) {
                var displayName = clipComponents[i].displayName;
                if (currentType.indexOf(displayName) !== -1) {
                    var targetEffect = clipComponents[i];
                    var targetProperty = targetEffect.properties[props];
                    if (!targetProperty.isTimeVarying()) {
                        var value = targetProperty.getValue();
                        var newValue = callback({ value: value, diff: diff, props: props, propsIndex: propsIndex });
                        targetProperty.setValue(newValue, true);
                        return 'succeeded';
                    }
                    else {
                        var time = app.project.activeSequence.getPlayerPosition();
                        var clipTime = (time.seconds - clip.start.seconds + clip.inPoint.seconds) * clip.getSpeed();
                        if (targetProperty.areKeyframesSupported() === true) {
                            var value = targetProperty.getValueAtTime(clipTime);
                            var newValue = callback({ value: value, diff: diff, props: props, propsIndex: propsIndex });
                            targetProperty.addKey(clipTime);
                            targetProperty.setValueAtKey(clipTime, newValue, true);
                            return 'succeeded';
                        }
                    }
                }
            }
        }
    }
};
exports["default"] = PrController;
