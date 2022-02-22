interface ReturnClipType {
  clip?: TrackItem;
  clipComponents?: ComponentCollection;
}
type EN_DISPLAY_TYPE = 'Opacity' | 'Motion' | 'Lumetri Color';
type KR_DISPLAY_TYPE = '불투명도' | '동작모션' | 'Lumetri 색상';

const PrController = {
  modify(props: number, diff: number, type: EN_DISPLAY_TYPE, cb: any, propsValueIndex?: number) {
    const { clip, clipComponents } = this.getClip();
    if (clipComponents && clip) {
      const name: string = clipComponents[0].displayName;
      const currentType: EN_DISPLAY_TYPE | KR_DISPLAY_TYPE = this.getDisplayName(name, type);
      for (let i: number = 0; i < clipComponents?.numItems; i++) {
        const { displayName } = clipComponents[i];
        if (currentType.indexOf(displayName) !== -1) {
          let targetEffect: Component = clipComponents[i];
          var targetProperty: ComponentParam = targetEffect.properties[props];
          if (!targetProperty.isTimeVarying()) {
            let value: number = targetProperty.getValue();
            let newValue = cb({
              value,
              diff,
              props,
              propsValueIndex,
            });
            targetProperty.setValue(newValue, true);
            return newValue.toFixed(1);
          } else {
            let time: Time = app.project.activeSequence.getPlayerPosition();
            var clipTime = (time.seconds - clip.start.seconds + clip.inPoint.seconds) * clip.getSpeed();
            if (targetProperty.areKeyframesSupported() === true) {
              let value = targetProperty.getValueAtTime(clipTime);
              let newValue = cb({
                value,
                diff,
                props,
                propsValueIndex,
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

  getClip(): ReturnClipType {
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
  getAppVersion(): number {
    const version: number = parseInt(app.version.split('.')[0]);
    return version;
  },
  getDisplayName(effectName: string, type: EN_DISPLAY_TYPE): EN_DISPLAY_TYPE | KR_DISPLAY_TYPE {
    const regExp = /[a-zA-Z]/;
    const checker = regExp.test(effectName);
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
  },
};

export default PrController;
