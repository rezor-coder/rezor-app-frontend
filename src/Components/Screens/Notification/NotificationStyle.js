import { StyleSheet } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Fonts, Colors } from '../../../theme';
import fonts from '../../../theme/Fonts';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';

export default StyleSheet.create({
  mainView: {
    justifyContent: 'center',
    flex: 1,
    marginTop: -100,
  },

  textStyle: {
    // color: Colors.white,
    color: ThemeManager.colors.textColor,
    fontFamily: fonts.regular,
    fontSize: areaDimen(16),
    textAlign: 'center',
  },
  imgViewStyle: {
    width: widthDimen(32),
    height: widthDimen(32),
    // marginRight: widthDimen(2),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: widthDimen(16)
  },
  imgStyle: { width: widthDimen(11), height: widthDimen(14) },
  imgWarningStyle: { width: widthDimen(22), height: widthDimen(28) },
  dateViewStyle: {
    height: widthDimen(25),
    justifyContent: 'center',
    borderRadius: widthDimen(2),
    marginTop: heightDimen(5)
  },
  viewStyle: {
    flexDirection: 'row',
    flex: 1,
    marginHorizontal: widthDimen(22),
  },
  headerStyle: {
    paddingTop: 20,
    paddingBottom: 28,
    // marginHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleStyle: {
    fontFamily: Fonts.regular,
    fontSize: 22,
    marginLeft: 13,
    // color: Colors.white,
    color: ThemeManager.colors.textColor,
  },
  texttttStyle: {
    fontFamily: Fonts.regular,
    fontSize: 20,
    alignSelf: 'center',
    // color: Colors.white,
    color: ThemeManager.colors.textColor,
  },

  tokenItem: {
    // borderWidth: 1,
    // borderColor: Colors.lossText,
    paddingTop: heightDimen(20),
    paddingBottom:heightDimen(10)
    // marginHorizontal: widthDimen(22),
    // borderBottomWidth:1,
    // borderRadius: 10,
    // marginVertical: 5,
    // marginHorizontal: 15,
    // alignItems: 'stretch',
    // backgroundColor: Colors.headerBg,
    // elevation: 5
  },

  FlatlistCellText: {
    fontSize: areaDimen(16),
    // color: Colors.activeText,
    fontFamily: Fonts.regular,
    textAlign: 'left',
  },
  FlatlistCellTextt: {
    fontSize: areaDimen(11),
    fontFamily: Fonts.regular,
    color: Colors.fadetext,
    // marginTop: 5,
    marginBottom: 2,
    padding:areaDimen(5)
  },
});
