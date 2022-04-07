import PrController from './main';
import PrUtils from './utils';

interface Params {
  readonly value: number | number[];
  readonly diff: number;
  readonly props?: number;
  readonly propsIndex?: number;
}

const PrOpacity = {
  modify(payload: Payload) {
    PrController.excute(payload, 'Opacity', PrOpacity.calcNewValue);
  },
  calcNewValue(params: Params): number | Error {
    const { value, diff } = params;
    if (typeof value === 'number') {
      const newValue = value + diff * Math.abs(diff);
      return newValue;
    } else {
      return new Error('empty value');
    }
  },
};

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

const PrLumetri = {
  modify(payload: Payload) {
    const version = PrUtils.getAppVersion();
    const { props } = payload;
    const newProps = version >= 22 ? props + 2 : props;
    payload = {
      ...payload,
      props: newProps,
    };
    PrController.excute(payload, 'Lumetri Color', PrLumetri.calcNewValue);
  },
  calcNewValue(params: Params): number | Error {
    const { value, diff, props } = params;
    if (typeof value === 'number' && props) {
      const weight = PrLumetri.setWeight(props);
      const newValue = value + diff * Math.abs(diff) * weight;
      return PrLumetri.minMax(props, newValue);
    } else {
      return new Error('empty value');
    }
  },
  setWeight(props: number) {
    const version = PrUtils.getAppVersion();
    if ((props === 14 && version < 22) || (props === 16 && version >= 22)) {
      return 0.1;
    } else {
      return 1;
    }
  },
  minMax(props: number, value: number) {
    const version = PrUtils.getAppVersion();
    const num = version >= 22 ? 2 : 0;

    switch (props) {
      //hdr white
      case 7:
        return PrUtils.minMax(value, 100, 1000);
      //온도 , 색조
      case 10 + num:
      case 11 + num:
        return PrUtils.minMax(value, -300, 300);
      //노출
      case 14 + num:
        return PrUtils.minMax(value, -7, 7);
      //대비 ,명도 , 어두운영역 ,흰색, 검정
      case 15 + num:
      case 16 + num:
      case 17 + num:
      case 18 + num:
      case 19 + num:
        return PrUtils.minMax(value, -150, 150);
      //채도
      case 24 + num:
        return PrUtils.minMax(value, 0, 300);

      //Lumetri Creative
      //강도
      case 31 + num:
        return PrUtils.minMax(value, 0, 200);
      //빛바랜 필름
      case 33 + num:
        return PrUtils.minMax(value, 0, 150);
      //선명 활기
      case 34 + num:
      case 35 + num:
        return PrUtils.minMax(value, -100, 100);
      // 채도
      case 36 + num:
        return PrUtils.minMax(value, 0, 300);
      // 색조 균형
      case 38 + num:
        return PrUtils.minMax(value, -150, 150);

      // Lumetri 곡선
      // hdr 범위
      case 45 + num:
        return PrUtils.minMax(value, 100, 10000);

      //hsl 보조
      // 노이즈 제거
      case 88 + num:
        return PrUtils.minMax(value, 0, 100);
      // 흐림
      case 89 + num:
        return PrUtils.minMax(value, 0, 1000);
      // 온도 색조
      case 94 + num:
      case 95 + num:
        return PrUtils.minMax(value, -300, 300);
      // 대비
      case 96 + num:
        return PrUtils.minMax(value, -150, 150);
      // 선명
      case 97 + num:
        return PrUtils.minMax(value, -100, 100);
      // 채도
      case 98 + num:
        return PrUtils.minMax(value, 0, 300);
      // Lumetri 비네팅
      // 양
      case 103 + num:
        return PrUtils.minMax(value, -5, 5);
      //중간점
      case 104 + num:
        return PrUtils.minMax(value, 0, 100);
      //원형률
      case 105 + num:
        return PrUtils.minMax(value, -100, 100);
      //페더
      case 106 + num:
        return PrUtils.minMax(value, 0, 100);
      default:
        return 0;
    }
  },
};
