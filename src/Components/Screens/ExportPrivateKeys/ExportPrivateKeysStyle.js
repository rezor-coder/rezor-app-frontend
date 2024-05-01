import { StyleSheet } from 'react-native';
import { Images, Colors, Fonts } from '../../../theme';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';

export const styles = StyleSheet.create({
  mainContainer: {
    marginTop: heightDimen(10),
    paddingHorizontal: widthDimen(22),
    paddingBottom:heightDimen(30)
  },
  blockChainWrap: {
    padding: widthDimen(18),
    marginTop: heightDimen(15),
    borderRadius: heightDimen(16)
  },
  headingStyle: {
    color: Colors.white,
    fontSize: areaDimen(16),
    fontFamily: Fonts.semibold,
    // padding: 10,
  },
  textStyle: {
    color: Colors.darkFade,
    fontSize: areaDimen(14),
    fontFamily: Fonts.regular,
    marginTop: heightDimen(8),
    lineHeight: areaDimen(22),
  },
});
