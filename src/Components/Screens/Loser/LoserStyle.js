import {StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../../theme';
export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  textStyle: {
    color: Colors.lightGrey2,
    opacity: 0.8,
    fontFamily: Fonts.regular,
    fontSize: 10,
  },
  coinStyle: {
    // letterSpacing: -1.52,
    fontFamily: Fonts.regular,
    fontSize: 13,
  },
  lastStyle: {
    color: Colors.activeText,
    letterSpacing: -1.52,
    fontFamily: Fonts.regular,
    fontSize: 15,
    textAlign: 'left',
    textTransform: 'uppercase',
  },
  textView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    alignSelf: 'center',
    paddingTop: 25,
  },

  sliderImgStyle: {height: '100%'},
});
