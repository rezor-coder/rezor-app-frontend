import { StyleSheet } from 'react-native';
import { ThemeManager } from '../../../../../ThemeManager';
import { Colors } from '../../../../theme';
import fonts from '../../../../theme/Fonts';
import { windowWidth } from '../../../../Constant';

export default StyleSheet.create({
  container: {
    flex: 1,

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
    marginTop: 30,
    marginBottom: 20,
    marginHorizontal: 15
  },

  headerStyle: {
    // color: Colors.White,
    color: ThemeManager.colors.textColor,
    fontSize: 30,
    fontFamily: fonts.bold, marginTop: 75,
    alignSelf: 'center'
  },

  BYsaita: {
    height: 70,
    width: 'auto',

    resizeMode: 'contain',

    alignSelf: 'center',
  },

  lablePrefLang: {
    color: Colors.lightGrey3,
    fontSize: 15,
    fontFamily: fonts.regular,
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: 8,
    opacity: 0.8,
    lineHeight: 25,
  },

  imgFlag: { width: 20, height: 20, marginEnd: 5 },

  customGrad: {
    borderRadius: 100,
    marginBottom: 20,
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
    fontFamily: fonts.semibold,
    fontSize: 8,
  },
  txttwo: {
    color: "#8F939E",
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
    color: "#989898",
    marginHorizontal: 40,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22
  },

  btnStylekyc: {
    width: windowWidth * 0.8,
    height: 50,
    marginTop: '15%',
  },
});
