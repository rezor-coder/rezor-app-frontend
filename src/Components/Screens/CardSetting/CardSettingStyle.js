import {StyleSheet} from 'react-native';
import {ThemeManager} from '../../../../ThemeManager';
import {Colors, Fonts} from '../../../theme';

export default StyleSheet.create({
  balanceView: {width: 100, marginRight: 3},
  card: {
    // backgroundColor: Colors.inputDarkbg,
    borderRadius: 10,
    resizeMode: 'contain',
    borderBottomColor: Colors.borderColor,
    borderBottomWidth: 0.2,
    borderBottomWidth:1
  },
  img: {width: 20, height: 20, resizeMode: 'contain'},
  leftImgStyle: {tintColor: Colors.White},
  rightImgStyle: {tintColor: Colors.White},
  textStyle: {
    fontSize: 15,
    fontFamily: Fonts.semibold,
    color: ThemeManager.colors.textColor,
    marginLeft: 15,
  },
  btnStyle: {
    width: '100%',
    height: 50,
    marginTop: 20,
    paddingHorizontal: 20,
    marginVertical: 30,
  },
});
