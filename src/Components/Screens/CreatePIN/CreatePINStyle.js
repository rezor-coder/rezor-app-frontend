import { Dimensions, StyleSheet } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Images, Colors, Fonts } from '../../../theme';
import fonts from '../../../theme/Fonts';
export const styles = StyleSheet.create({
  mainView: {
    // backgroundColor: Colors.Darkbg,
    flex: 1,
    alignItems: 'center',
  },
  textInputView: {
    paddingTop: 40,
  },
  textInput: {
    alignSelf: 'flex-start',
    marginLeft: -10,
  },
  pinText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: fonts.regular,
  },
  inputView: { paddingTop: 30 },
  confiemPinView: {
    paddingTop: 60,
    paddingBottom: 65,
  },
  // btnStyle: {
  //   height: 50,
  //   width: 280,
  //   alignSelf: 'center',
  // },
  btnStyle: {
    width: '100%',
    height: 50,
    // marginTop: 20,
    paddingHorizontal: 32,
    marginTop: 40,
  },

  customGrad: {
    borderRadius: 12,
    marginBottom: 40,
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
  cellFocus: { borderColor: '#fff' },
  createPinTxt: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: fonts.regular,
  },
  text: {
    color: Colors.fadetext,
    alignSelf: 'center',
    fontFamily: fonts.regular,
  },
  btnView2: {
    marginTop: Dimensions.get('screen').height < 670 ? 10 : 30,
    alignSelf: 'center',
    height: 40,
    width: 50,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 7,
  },
  pinRequiredTextWrap: {
    marginTop: 20,
  },

  labelCreatePin: {
    // color: Colors.white,
    color: ThemeManager.colors.textColor,
    fontFamily: fonts.bold,
    alignSelf: 'center',
    fontSize: 30,
    marginTop: 40,
  },
  sixDigitPinStyle: {
    color: Colors.languageItem,
    fontFamily: fonts.regular,
    fontSize: 15,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 36,
    opacity: 0.9,
    lineHeight: 25,
  },
  viewPinContain: { marginTop: 55, alignItems: 'center', marginBottom: 20 },
  rightLine: {
    borderRightColor: Colors.pinLineColor,
    borderRightWidth: 0.5,
  },
  digit: {
    width: "33.33%",
    alignItems: "center",
    padding: "5%",
    borderBottomColor: Colors.pinLineColor,
    borderBottomWidth: 0.5,
  },
  topRightLine: {
    borderTopColor: Colors.pinLineColor,
    borderTopWidth: 0.5,
    borderRightColor: Colors.pinLineColor,
    borderRightWidth: 0.5,
  },
  topLine: {
    borderTopColor: Colors.pinLineColor,
    borderTopWidth: 0.5,
  },
  rightLine: {
    borderRightColor: Colors.pinLineColor,
    borderRightWidth: 0.5,
  },
  digitImage: {
    width: "33.33%",
    alignItems: "center",
    padding: "6.1%",
    borderBottomColor: Colors.pinLineColor,
    borderBottomWidth: 0.5,
  },
});
