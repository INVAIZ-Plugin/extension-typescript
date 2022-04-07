
PrController = {
    excute: function (payload, type, callback) {
        var props = payload.props, propsIndex = payload.propsIndex, diff = payload.diff;
        var _a = PrUtils.getClip(), clip = _a.clip, clipComponents = _a.clipComponents;
        if (clipComponents && clip) {
            var name_1 = clipComponents[0].displayName;
            var currentType = PrUtils.getDisplayName(name_1, type);
            for (var i = 0; i < (clipComponents === null || clipComponents === void 0 ? void 0 : clipComponents.numItems); i++) {
                var displayName = clipComponents[i].displayName;
                if (currentType.indexOf(displayName) !== -1) {
                    var targetEffect = clipComponents[i];
                    var targetProperty = targetEffect.properties[props];
                    if (!targetProperty.isTimeVarying()) {
                        var value = targetProperty.getValue();
                        var newValue = callback(value, diff, props, propsIndex);
                        targetProperty.setValue(newValue, true);
                        return 'succeeded';
                    }
                    else {
                        var time = app.project.activeSequence.getPlayerPosition();
                        var clipTime = (time.seconds - clip.start.seconds + clip.inPoint.seconds) * clip.getSpeed();
                        if (targetProperty.areKeyframesSupported() === true) {
                            var value = targetProperty.getValueAtTime(clipTime);
                            var newValue = callback(value, diff, props, propsIndex);
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


 PrUtils = {
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
    getSequenceFrame: function () {
        var seq = app.project.activeSequence;
        var setting = seq.getSettings();
        var previewFrameWidth = setting.previewFrameWidth;
        var previewFrameHeight = setting.previewFrameHeight;
        var frameObj = {
            width: previewFrameWidth,
            height: previewFrameHeight
        };
        return frameObj;
    },
    getAppVersion: function () {
        var version = parseInt(app.version.split('.')[0]);
        return version;
    },
    getDisplayName: function (effectName, type) {
        var regExp = /[a-zA-Z]/;
        var match = regExp.test(effectName);
        switch (type) {
            case 'Opacity':
                return match ? 'Opacity' : '불투명도';
            case 'Motion':
                return match ? 'Motion' : '동작모션';
            case 'Lumetri Color':
                return match ? 'Lumetri Color' : 'Lumetri 색상';
            default:
                return 'Motion';
        }
    },
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

PrMotion = {
  modify: function (payload) {
  PrController.excute(payload, 'Motion', PrMotion.calcNewValue);
  },
  calcNewValue: function (value, diff, propsIndex) {
    if (propsIndex && Array.isArray(value)) {
      var seqFrame = PrUtils.getSequenceFrame();
      var standard = propsIndex === 0 ? seqFrame.width : seqFrame.height;
      var newValue = standard * value[propsIndex] + diff * (Math.abs(diff) * 1.7);
      value[propsIndex] = newValue / standard;
      return value;
    } else if (typeof value === 'number') {
      var newValue = value + diff * Math.abs(diff);
      return newValue;
    }
  },
};
var payload ={
        diff :1,
        props: 0,
        propsIndex: 1
    }
PrMotion.modify(payload);

