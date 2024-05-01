import { StyleSheet } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Colors, Fonts } from '../../../theme';
import { windowWidth } from '../../../Constant';

export default StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    alignItems: 'center'
    // backgroundColor: Colors.black
  },
  upperTextWrapStyle: {
    // marginTop: 20,
    alignItems: 'center',
  },
  textSimple: {
    fontSize: 30,
    color: Colors.languageItem,
  },
  signupText: {
    fontSize: 22,
    color: Colors.buttonColor1,
  },
  gradientStyle: {
    width: '50%',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: 10,
    flexDirection: 'row',
  },
  forgotPassText: {
    fontSize: 15,
    color: Colors.languageItem,
    alignSelf: 'flex-end',
  },
  iconStyle: {
    position: 'absolute',
    width: 22,
    height: 22,
    resizeMode: 'contain',
    top: 43,
    left: '70%',
  },
  btnStyle: {
    width: windowWidth * 0.8,
    height: 50,
    marginTop: '15%',
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
    // color: '#fff',
  },



  imgcards: {
    height: "100%", width: "100%", borderRadius: 20, overflow: 'hidden', alignItems: 'center', justifyContent: 'center',
  },
  txtone: {
    color: Colors.White,
    fontFamily: Fonts.semibold,
    fontSize: 8,
  },
  txttwo: {
    color: "#8F939E",
    fontFamily: Fonts.bold,
    fontSize: 14,
  },
  txtthree: {

    color: Colors.White,
    fontFamily: Fonts.bold,
    fontSize: 16,
  },
  txtWelcome: {
    fontFamily: Fonts.semibold,
    fontSize: 20,
    alignSelf: 'center',
    textAlign: 'center',
  },
  txtkyc: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: "#989898",
    marginHorizontal: 40,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22
  },
  customGrad: {
    borderRadius: 12,
  },

  numbertitleStyle: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.placeHolderColor,
    marginTop: 10,
  },
});
