"use strict";
exports.__esModule = true;
var PrController = {
    modify: function (props, diff, type, cb, propsValueIndex) {
        var _a = this.getClip(), clip = _a.clip, clipComponents = _a.clipComponents; //클립 가져오기
        if (clipComponents && clip) {
            var name_1 = clipComponents[0].displayName;
            var currentType = this.getDisplayName(name_1, type);
            for (var i = 0; i < (clipComponents === null || clipComponents === void 0 ? void 0 : clipComponents.numItems); i++) {
                var displayName = clipComponents[i].displayName;
                if (currentType.indexOf(displayName) !== -1) {
                    var targetEffect = clipComponents[i];
                    var targetProperty = targetEffect.properties[props];
                    if (!targetProperty.isTimeVarying()) {
                        var value = targetProperty.getValue();
                        var newValue = cb({
                            value: value,
                            diff: diff,
                            props: props,
                            propsValueIndex: propsValueIndex
                        });
                        targetProperty.setValue(newValue, true);
                        return newValue.toFixed(1);
                    }
                    else {
                        var time = app.project.activeSequence.getPlayerPosition();
                        var clipTime = (time.seconds - clip.start.seconds + clip.inPoint.seconds) *
                            clip.getSpeed();
                        if (targetProperty.areKeyframesSupported() === true) {
                            var value = targetProperty.getValueAtTime(clipTime);
                            var newValue = cb({
                                value: value,
                                diff: diff,
                                props: props,
                                propsValueIndex: propsValueIndex
                            });
                            targetProperty.addKey(clipTime);
                            targetProperty.setValueAtKey(clipTime, newValue, true);
                            return 'succeeded';
                        }
                    }
                }
            }
        }
    },
    getClip: function () {
        var project = app.project;
        var seq = project.activeSequence;
        var tracks = seq.videoTracks;
        var clip = this.getSelecedClip(tracks);
        var clipComponents = clip === null || clip === void 0 ? void 0 : clip.components;
        return { clip: clip, clipComponents: clipComponents };
    },
    getSelecedClip: function (videoTracks) {
        var selectedClip = null;
        for (var i = 0; i < videoTracks.numTracks; i++) {
            var currentTrack = videoTracks[i].clips;
            for (var j = 0; j < currentTrack.numItems; j++) {
                var currentClip = currentTrack[j];
                if (currentClip.isSelected()) {
                    selectedClip = currentClip;
                    return selectedClip;
                }
            }
        }
        return undefined;
    },
    getAppVersion: function () {
        var version = parseInt(app.version.split('.')[0]);
        return version;
    },
    getDisplayName: function (effectName, type) {
        var check_eng = /[a-zA-Z]/; // 문자
        var checker = check_eng.test(effectName);
        switch (type) {
            case 'Opacity':
                return checker ? 'Opacity' : '불투명도';
            case 'Motion':
                return checker ? 'Motion' : '동작모션';
            case 'Lumetri Color':
                return checker ? 'Lumetri Color' : 'Lumetri 색상';
            default:
                return 'Motion';
        }
    }
};
exports["default"] = PrController;
