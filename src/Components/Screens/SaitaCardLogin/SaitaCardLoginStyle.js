import {StyleSheet} from 'react-native';
import {ThemeManager} from '../../../../ThemeManager';
import {Colors, Fonts} from '../../../theme';
import fonts from '../../../theme/Fonts';
import {windowWidth} from '../../../Constant';
import {
  areaDimen,
  heightDimen,
  width,
  widthDimen,
} from '../../../Utils/themeUtils';

export default StyleSheet.create({
  container: {
    flex: 2.5,
    marginHorizontal: widthDimen(22),
  },

  containerScroll: {
    flex: 1,
    // backgroundColor:Colors.black
  },

  selectLanguageWrapStyle: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    flexWrap: 'wrap',
  },
  languageItemWrapStyle: {
    // borderColor: Colors.languageItem,
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 30,
    flexDirection: 'row',
    width: '45%',
    height: 55,
    padding: 10,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  languageItemStyle: {
    fontSize: 14,
    color: Colors.languageItem,
    fontFamily: fonts.medium,
    textAlign: 'center',
  },
  btnStyle: {
    height: 50,
    marginTop: 20,
    marginBottom: heightDimen(20),
  },
  headerStyle: {
    color: ThemeManager.colors.textColor,
    fontSize: 30,
    fontFamily: fonts.bold,
    marginTop: 75,
    alignSelf: 'center',
  },

  BYsaita: {
    height: 70,
    width: 'auto',

    resizeMode: 'contain',

    alignSelf: 'center',
  },

  lablePrefLang: {
    fontSize: areaDimen(30),
    fontFamily: fonts.semibold,
    alignSelf: 'flex-start',
    lineHeight: heightDimen(37),
  },

  imgFlag: {width: 20, height: 20, marginEnd: 5},

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
    // color: '#fff',
  },

  imgcards: {
    height: '100%',
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtone: {
    color: Colors.White,
    fontFamily: fonts.semibold,
    fontSize: 8,
  },
  txttwo: {
    color: '#8F939E',
    fontFamily: fonts.bold,
    fontSize: 14,
  },
  txtthree: {
    color: Colors.White,
    fontFamily: fonts.bold,
    fontSize: 16,
  },
  txtWelcome: {
    fontFamily: fonts.semibold,
    fontSize: 20,
    alignSelf: 'center',
    textAlign: 'center',
  },
  txtkyc: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: '#989898',
    marginHorizontal: 40,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
  customGrad: {
    borderRadius: 12,
  },
  customGrad2: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ThemeManager.colors.textColor,
  },
  btnStylekyc: {
    width: windowWidth * 0.8,
    height: 50,
    marginTop: 20,
  },
  // ----------------------------------------------------------------
  straproStyle: {
    fontSize: areaDimen(18),
    fontFamily: Fonts.semibold,
    color: Colors.buttonColor1,
    lineHeight: heightDimen(22),
  },
  loginDiscription: {
    fontSize: areaDimen(30),
    fontFamily: Fonts.semibold,
    alignSelf: 'flex-start',
    lineHeight: heightDimen(37),
  },
  logoStyle: {
    height: heightDimen(32.3),
    width: widthDimen(25.5),
    resizeMode: 'contain',
    transform: [{rotate: '45deg'}],
    tintColor: Colors.buttonColor1,
    marginRight: areaDimen(6),
  },
  loginTextView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: areaDimen(16),
  },
  buttonView: {
    width: width - 52,
    height: heightDimen(50),
    borderRadius: areaDimen(25),
    marginTop: areaDimen(24),
    alignSelf: 'center',
    marginBottom: areaDimen(24),
  },
  buttonText: {
    textAlign: 'center',
    color: Colors.white,
    fontSize: areaDimen(16),
    fontFamily: Fonts.semibold,
  },
  registerText: {
    textAlign: 'center',
    fontSize: areaDimen(16),
    fontFamily: Fonts.semibold,
    lineHeight: heightDimen(19),
    marginBottom: areaDimen(35),
  },
  inputTextStyle: {
    fontFamily: Fonts.medium,

    fontSize: areaDimen(14),
    // flexGrow: 0.96,
  },
  dialCodeView: {
    left: 5,
    marginRight: 10,
    flexGrow: 0.04,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
