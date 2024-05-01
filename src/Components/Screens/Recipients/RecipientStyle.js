import { StyleSheet, Dimensions } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Images, Colors, Fonts } from '../../../theme';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';

export default StyleSheet.create({
  searchBarStyle: {
    // backgroundColor: Colors.screenBg,
    flex: 1,
    // paddingHorizontal: 20,
  },
  recipient_list: {
    paddingVertical: heightDimen(16),
  },
  addressLabelTextStyle: {
    fontFamily: Fonts.regular,
    fontSize: areaDimen(14),
    marginHorizontal: widthDimen(22)
  },
  addressTextStyle: {
    fontFamily: Fonts.regular,
    fontSize: areaDimen(14),
    marginTop: heightDimen(6),
    marginHorizontal: widthDimen(22)
  },
  amountTextStyle: {
    fontFamily: Fonts.regular,
    fontSize: areaDimen(14),
    marginTop: heightDimen(6),
    marginHorizontal: widthDimen(22)
  },
});
