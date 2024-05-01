import { StyleSheet, Dimensions } from 'react-native';
import { Images, Colors, Fonts } from '../../../theme';
import fonts from '../../../theme/Fonts';
import { ThemeManager } from '../../../../ThemeManager';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';

export const styles = StyleSheet.create({
  BYsaita: {
    height: 33,
    width: 30,

    resizeMode: 'contain',

    alignSelf: 'center',
  },

  centerLottie: {
    height: 250,
    width: 300,
    resizeMode: 'stretch',
    alignSelf: 'center',
  },

  container: {
    flex: 1,
    
    paddingVertical:heightDimen(20)
  },

  backTouchable: { marginTop: 44, marginStart: 12, padding: 5 },

  imgBackStyle: { width: 18, height: 18, resizeMode: 'contain' },

  imgSaitaPro: {
    height: 110,
    width: 140,

    resizeMode: 'contain',

    alignSelf: 'center',
    marginTop: 10,
  },

  txtEaseToUse: {
    color: Colors.White,
    fontFamily: fonts.semibold,
    fontSize: areaDimen(24),
    alignSelf: 'center',
    textAlign: 'center',
    paddingHorizontal: 12,
  },

  txtAllTx: {
    color: ThemeManager.colors.lightTextColor,
    fontFamily: fonts.regular,
    fontSize: areaDimen(14),
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: heightDimen(10),
    paddingHorizontal: widthDimen(64),
    // opacity: 0.9,
    lineHeight: heightDimen(22),
  },

  btnStyle: {
    width: '100%',
    // height: heightDimen(50),
    // marginTop: 35,
    paddingHorizontal: widthDimen(22),
    marginTop: heightDimen(140),
  },

  customGrad: {
    borderRadius: heightDimen(30),
  },
  importBtnStyle: {
    width: '100%',
    height: heightDimen(60),
    // marginTop: 35,
    paddingHorizontal: widthDimen(22),
    marginTop: heightDimen(18),
  },
  txtImportWallet: {
    // color: Colors.White,
    fontFamily: fonts.semibold,
    fontSize: areaDimen(16),
    alignSelf: 'center',
    textAlign: 'center',
    // marginTop: 10,
    // padding: 5,
    // marginBottom: 40,
  },
});
