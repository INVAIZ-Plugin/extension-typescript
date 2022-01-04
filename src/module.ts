import PrController from './controller';
import PrUtils from './utils';
interface CalcOption {
  value: number;
  diff: number;
  props: number;
  propsValueIndex: number | undefined;
}
interface CalcMotion {
  value: any;
  diff: number;
  props: number;
  propsValueIndex: number | undefined;
}

const PrOpacity = {
  modify(props: number, diff: number) {
    PrController.modify(props, diff, 'Opacity', this.calcNewValue);
  },
  calcNewValue(obj: CalcOption): number {
    const { value, diff } = obj;
    let newValue = value + diff * Math.abs(diff);
    return newValue;
  },
};

const PrMotion = {
  modify(props: number, diff: number, propsValueIndex: number) {
    PrController.modify(
      props,
      diff,
      'Motion',
      this.calcNewValue,
      propsValueIndex
    );
  },
  calcNewValue(obj: CalcMotion) {
    const { value, diff, propsValueIndex } = obj;
    let newValue: number | number[];
    if (propsValueIndex) {
      newValue = this.calcPositionValue(value, diff, propsValueIndex);
    } else {
      newValue = value + diff * Math.abs(diff);
    }
    return newValue;
  },
  calcPositionValue(value: any, diff: number, props: number): number[] {
    var standard = props === 0 ? 640 : 320;
    var newValue = standard * value[props] + diff * (Math.abs(diff) * 1.7);
    value[props] = newValue / standard;
    return value;
  },
};

const PrLumetri = {
  modify(props: number, diff: number) {
    const version = PrController.getAppVersion();
    props += version >= 22 ? 2 : 0;
    PrController.modify(props, diff, 'Lumetri Color', this.calcLumetri);
  },
  calcLumetri(obj: CalcOption) {
    const { value, diff, props } = obj;
    const version: number = parseInt(app.version.split('.')[0]);
    let newValue = value + diff * Math.abs(diff);
    let temp: number = version >= 22 ? 2 : 0;
    switch (props) {
      case 10 + temp:
      case 11 + temp:
        return PrUtils.minMax(newValue, -300, 300);
      default:
        return 0;
    }
  },
};
