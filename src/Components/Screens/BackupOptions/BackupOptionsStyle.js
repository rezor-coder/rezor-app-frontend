import {StyleSheet} from 'react-native';
import {ThemeManager} from '../../../../ThemeManager';
import {Images, Colors, Fonts} from '../../../theme';
import fonts from '../../../theme/Fonts';

export default StyleSheet.create({
  searchBarStyle: {
    backgroundColor: Colors.headerBg,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    paddingTop: 25,
  },
  inputStyle: {
    paddingLeft: 55,
    backgroundColor: Colors.searchBoxbg,
  },
  addWallet__style: {
    position: 'absolute',
    right: 30,
    bottom: 25,
  },
  balanceView: {width: 100, marginRight: 3},
  card: {
    backgroundColor: Colors.inputDarkbg,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  img: {width: 20, height: 20, resizeMode: 'contain'},
  optionStyle: {
    color: ThemeManager.colors.textColor,
    fontSize: 13,
    fontFamily: Fonts.semibold,
    marginVertical: 10,
    marginTop: 30,
    marginLeft: 20,
  },
  securityView: {
    backgroundColor: ThemeManager.colors.backupView,
    marginHorizontal: 20,
    borderRadius: 14,
    marginTop: 10,
  },
  linkStyle: {
    color: ThemeManager.colors.textColor,
    fontSize: 14,
    fontFamily: fonts.light,
  },
  securityViewStyle: {
    height: 2,
    width: '100%',
    backgroundColor: ThemeManager.colors.chooseBorder,
    // marginVertical: 10,
    opacity: 0.6,
  },
  borderWidthStyle: {
    borderBottomWidth: 0,
    // borderBottomColor: Colors.borderColor,
  },
});
