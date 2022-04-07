app.enableQE();

interface ReturnType {
  clip?: TrackItem;
  clipComponents?: ComponentCollection;
}
const PrUtils = {
  getClip(): ReturnType {
    const project: Project = app.project;
    const seq: Sequence = project.activeSequence;
    const tracks: TrackCollection = seq.videoTracks;
    const clip: TrackItem | undefined = this.getSelecedClip(tracks);
    const clipComponents: ComponentCollection | undefined = clip?.components;
    return { clip, clipComponents };
  },
  getSelecedClip(videoTracks: TrackCollection): TrackItem | undefined {
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
    var seq: Sequence = app.project.activeSequence;
    var setting = seq.getSettings();
    var previewFrameWidth = setting.previewFrameWidth;
    var previewFrameHeight = setting.previewFrameHeight;
    var frameObj = {
      width: previewFrameWidth,
      height: previewFrameHeight,
    };
    return frameObj;
  },
  getAppVersion(): number {
    const version: number = parseInt(app.version.split('.')[0]);
    return version;
  },
  getDisplayName(effectName: string, type: EN | KR): EN | KR {
    const regExp = /[a-zA-Z]/;
    const match = regExp.test(effectName);
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
  minMax: function (value: number, min: number, max: number): number {
    if (value < min) {
      return min;
    } else if (value > max) {
      return max;
    } else {
      return value;
    }
  },

  addEffect: function (videoTracks: TrackCollection, effectName: string) {
    for (var i = 0; i < videoTracks.numTracks; i++) {
      var qe: any;
      var track = qe.project.getActiveSequence().getVideoTrackAt(i);
      for (var j = 0; j < track.numItems; j++) {
        var currentClip = track.getItemAt(j);
        var clip = PrUtils.getSelecedClip(videoTracks);
        if (currentClip.start.ticks === clip?.start.ticks) {
          currentClip.addVideoEffect(qe.project.getVideoEffectByName(effectName));
        }
      }
    }
  },
};

export default PrUtils;
