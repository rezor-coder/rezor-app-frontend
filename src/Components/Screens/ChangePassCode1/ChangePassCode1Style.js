import {StyleSheet} from 'react-native';
import {Images, Colors, Fonts} from '../../../theme';

export default StyleSheet.create({
  pinRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
  },
  indicatorWrapStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 70,
  },
  enterPinWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 55,
  },
  enterPinTextStyle: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.digitTextColor,
  },
});
