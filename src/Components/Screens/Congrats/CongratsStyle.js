import { StyleSheet, Dimensions } from 'react-native';
import { Images, Colors, Fonts } from '../../../theme';
import fonts from '../../../theme/Fonts';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';

export const styles = StyleSheet.create({
  btnStyle: {
    width: '100%',
    height: heightDimen(60),
    paddingHorizontal: widthDimen(22),
  },

  customGrad: {
    borderRadius: heightDimen(30),
  },

  txtDesc: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: areaDimen(14),
    fontFamily: fonts.regular,
    lineHeight: widthDimen(22),
    marginHorizontal: widthDimen(22)
  },

  txtCongrats: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: areaDimen(24),
    fontFamily: fonts.semibold,
    // color: Colors.white,
    marginBottom: 5,
  },

  viewContents: {
    // bottom: 55,
    // paddingHorizontal: 32,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
});
