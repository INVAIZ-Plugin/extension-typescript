'use strict';
exports.__esModule = true;
app.enableQE();
var PrUtils = {
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
      height: previewFrameHeight,
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
    } else if (value > max) {
      return max;
    } else {
      return value;
    }
  },
  addEffect: function (videoTracks, effectName) {
    for (var i = 0; i < videoTracks.numTracks; i++) {
      var qe;
      var track = qe.project.getActiveSequence().getVideoTrackAt(i);
      for (var j = 0; j < track.numItems; j++) {
        var currentClip = track.getItemAt(j);
        var clip = PrUtils.getSelecedClip(videoTracks);
        if (currentClip.start.ticks === (clip === null || clip === void 0 ? void 0 : clip.start.ticks)) {
          currentClip.addVideoEffect(qe.project.getVideoEffectByName(effectName));
        }
      }
    }
  },
};
exports['default'] = PrUtils;
