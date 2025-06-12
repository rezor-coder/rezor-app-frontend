import { StyleSheet } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Colors, Fonts } from '../../../theme';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';

export default StyleSheet.create({
  balanceView: { width: 100, marginRight: 3 },
  card: {
    // backgroundColor: Colors.inputDarkbg,
    borderRadius: 10,
    resizeMode: 'contain',
    borderBottomColor: Colors.borderColor,
    borderBottomWidth: 0.2,
  },
  img: { width: 20, height: 20, resizeMode: 'contain' },
  leftImgStyle: { tintColor: Colors.White },
  rightImgStyle: { tintColor: Colors.White },
  textStyle: {
    fontSize: 15,
    fontFamily: Fonts.semibold,
    color: ThemeManager.colors.textColor,
    marginLeft: 15,
  },
  btnStyle: {
    width: '100%',
    height: 50,
    marginTop: 20,
    paddingHorizontal: 20,
    marginVertical: 30,
  },
  languageItemWrapStyle: {
    backgroundColor: 'white',
    // borderColor: Colors.languageItem,
    // borderWidth: areaDimen(1),
    borderRadius: areaDimen(12),
    marginTop: heightDimen(10),
    flexDirection: 'row',
    width: '100%',
    height: heightDimen(66),
    padding: areaDimen(10),
    alignItems: 'center',
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 3.05,
    // elevation: 4,
    paddingHorizontal: widthDimen(16)
  },
  languageItemStyle: {
    fontSize: areaDimen(16),
    color: Colors.languageItem,
    fontFamily: Fonts.semibold,
    marginLeft: widthDimen(12)
  },

});
