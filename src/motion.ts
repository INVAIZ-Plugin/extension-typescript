import PrController from './main';
import PrUtils from './utils';

// interface MotionEffect {
//   position: Effect;
//   scale: Effect;
//   scaleWidth: Effect;
//   rotate: Effect;
//   anchorPoint: Effect;
//   antiFickerFilter: Effect;
// }

const PrMotion = {
  modify(payload: Payload) {
    PrController.excute(payload, 'Motion', PrMotion.calcNewValue);
  },
  calcNewValue(params: Params) {
    const { value, diff, propsIndex } = params;
    if (propsIndex && Array.isArray(value)) {
      const seqFrame = PrUtils.getSequenceFrame();
      const standard = propsIndex === 0 ? seqFrame.width : seqFrame.height;
      const newValue = standard * value[propsIndex] + diff * (Math.abs(diff) * 1.7);
      value[propsIndex] = newValue / standard;
      return value;
    } else if (typeof value === 'number') {
      let newValue: number = value + diff * Math.abs(diff);
      return newValue;
    }
  },
};
