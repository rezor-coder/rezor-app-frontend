import { Dimensions, StyleSheet } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Images, Colors, Fonts } from '../../../theme';
import fonts from '../../../theme/Fonts';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';
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
    height: heightDimen(60),
    // marginTop: 20,
    paddingHorizontal: widthDimen(22),
    marginTop: heightDimen(35),
    marginBottom:heightDimen(20)
  },

  customGrad: {
    borderRadius: heightDimen(30),
  },
  marginBtn: {
    marginTop: heightDimen(110),
    
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


  sixDigitPinStyle: {
    color: Colors.languageItem,
    fontFamily: fonts.regular,
    fontSize: areaDimen(14),
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: heightDimen(160),
    paddingHorizontal: widthDimen(22),
    // opacity: 0.9,
    lineHeight: 22,
  },
  viewPinContain: { marginTop: heightDimen(30), alignItems: 'center', marginHorizontal: heightDimen(22), flexDirection: 'row' },
});
