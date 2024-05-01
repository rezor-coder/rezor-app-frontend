import { StyleSheet, Dimensions } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Images, Colors, Fonts } from '../../../theme';
import fonts from '../../../theme/Fonts';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  mainView: { flex: 1 },
  img: {
    height: 100,
    width: 400,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 120,
  },
  imgView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 120,
    paddingHorizontal: 20,
  },
  iconAdd: {
    height: 100,
    width: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  text: {
    // color: Colors.white,
    color: ThemeManager.colors.textColor,
    alignSelf: 'center',
    marginTop: 15,
    fontFamily: fonts.regular,
  },
  iconView: {
    height: 100,
    width: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  unuqueText: {
    // color: Colors.white,
    color: ThemeManager.colors.textColor,
    alignSelf: 'center',
    marginTop: 15,
    fontFamily: fonts.regular,
  },
  btnView2: {
    // backgroundColor: 'red',
    alignSelf: 'center',
    height: 40,
    width: 56,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 7,
    marginBottom: 40,
  },

  labelCreatePin: {
    // color: Colors.white,
    color: ThemeManager.colors.textColor,
    fontFamily: fonts.semibold,
    alignSelf: 'flex-start',
    fontSize: areaDimen(30),
    lineHeight: areaDimen(37),
    marginTop: heightDimen(30),
  },

  sixDigitPinStyle: {
    fontFamily: fonts.regular,
    fontSize: areaDimen(14),
    textAlign: 'left',
    // opacity: 0.8,
    lineHeight: heightDimen(28),
  },

  cellStyle: {
    borderWidth: 1,
    borderRadius: 12,
    // width: 48,
    // height: 55,
    borderColor: Colors.languageItem,
    marginLeft: 10,
  },
  inputText: {
    fontSize: 20,
    color: '#fff',
  },

  viewPinContain: { marginTop: heightDimen(60), alignItems: 'center', marginBottom: 20, flexDirection: 'row' },

  cellFocus: { borderColor: '#fff' },

  backTouchable: { marginTop: 44, marginStart: 12, padding: 5 },

  imgBackStyle: { width: 26, height: 26, tintColor: Colors.white },

  customBack: { tintColor: Colors.white },

  btnStyle: {
    width: '100%',
    height: heightDimen(60),
    paddingHorizontal: widthDimen(22),
    marginTop: heightDimen(30),
    marginBottom:heightDimen(20)
  },

  customGrad: {
    borderRadius: heightDimen(30),
  },
  marginBtn: {
    justifyContent: 'flex-end',
    flex: 1,
    marginTop: heightDimen(150),
  },

});
