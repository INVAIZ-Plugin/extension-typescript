import PrUtils from './utils';
const PrController = {
  excute(payload: Payload, type: EN, callback: any) {
    const { props, propsIndex, diff } = payload;
    const { clip, clipComponents } = PrUtils.getClip();
    if (clipComponents && clip) {
      const name: string = clipComponents[0].displayName;
      const currentType: EN | KR = PrUtils.getDisplayName(name, type);
      for (let i: number = 0; i < clipComponents?.numItems; i++) {
        const { displayName } = clipComponents[i];
        if (currentType.indexOf(displayName) !== -1) {
          let targetEffect: Component = clipComponents[i];
          var targetProperty: ComponentParam = targetEffect.properties[props];
          if (!targetProperty.isTimeVarying()) {
            let value = targetProperty.getValue();
            let newValue = callback({ value, diff, props, propsIndex });
            targetProperty.setValue(newValue, true);
            return 'succeeded';
          } else {
            let time: Time = app.project.activeSequence.getPlayerPosition();
            var clipTime: number = (time.seconds - clip.start.seconds + clip.inPoint.seconds) * clip.getSpeed();
            if (targetProperty.areKeyframesSupported() === true) {
              let value = targetProperty.getValueAtTime(clipTime);
              let newValue = callback({ value, diff, props, propsIndex });
              targetProperty.addKey(clipTime);
              targetProperty.setValueAtKey(clipTime, newValue, true);
              return 'succeeded';
            }
          }
        }
      }
    }
  },
};

export default PrController;
