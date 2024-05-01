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


  sixDigitPinStyle: {
    color: Colors.languageItem,
    fontFamily: fonts.regular,
    fontSize: areaDimen(14),
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: heightDimen(160),
    paddingHorizontal: widthDimen(22),
    // opacity: 0.9,
    lineHeight: heightDimen(20),
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

  viewPinContain: {
    marginTop: heightDimen(30),
    alignItems: 'center',
    flexDirection: 'row', marginHorizontal: heightDimen(22)
  },

  cellFocus: { borderColor: '#fff' },

  backTouchable: { marginTop: 44, marginStart: 12, padding: 5 },

  imgBackStyle: { width: 26, height: 26, tintColor: Colors.white },

  customBack: { tintColor: Colors.white },

  btnStyle: {
    width: '100%',
    height: heightDimen(60),
    // marginTop: 20,
    paddingHorizontal: widthDimen(22),
    marginTop: heightDimen(25),
    marginBottom:heightDimen(20)
  },

  customGrad: {
    borderRadius: heightDimen(30),

  },
  marginBtn: { marginTop: heightDimen(110),
   },
});
