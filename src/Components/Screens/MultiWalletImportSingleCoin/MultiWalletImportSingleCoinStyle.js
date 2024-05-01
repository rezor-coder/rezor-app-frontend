import {StyleSheet} from 'react-native';
import {ThemeManager} from '../../../../ThemeManager';
import {Images, Colors, Fonts} from '../../../theme';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';

export default StyleSheet.create({
  headerRowTwoStyle__subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 21,
    // color: Colors.white,
    color: ThemeManager.colors.textColor,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  descriptionWrapStyle: {
    alignItems: 'flex-start',
    marginHorizontal: widthDimen(22),
    marginTop: heightDimen(6),
  },
  descriptionTextStyle: {
    fontFamily: Fonts.regular,
    fontSize: areaDimen(14),
    textAlign: 'left',
    // opacity: 0.8,
    lineHeight: heightDimen(22),
  },

  headerRowTwoStyle__title: {
    fontFamily: Fonts.normal,
    fontSize: 16,
    // color: Colors.white,
    color: ThemeManager.colors.textColor,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  headerRow__title: {
    fontFamily: Fonts.semibold,
    fontSize: areaDimen(16),
    // color: Colors.white,
    color: Colors.lightGrey3,
    marginHorizontal: widthDimen(22),
    marginTop: heightDimen(20),
  },
  textStyleEnable: {
    fontFamily: Fonts.semibold,
    fontSize: areaDimen(16),
    // lineHeight: 21,
    // color: Colors.White,
    color: Colors.white,
    paddingHorizontal: widthDimen(41),
    // paddingVertical: 15
  },
  textStyleDisable: {
    fontFamily: Fonts.semibold,
    fontSize: areaDimen(16),
    // lineHeight: 21,
    // color: Colors.White,
    color: Colors.white,
    paddingHorizontal: widthDimen(41),
    // paddingVertical: 15
  },
  inputStyle: {
    backgroundColor: Colors.inputDarkbg,
    borderRadius: 21,
    paddingHorizontal: 25,

    // color: Colors.White,
    color: ThemeManager.colors.textColor,
    fontFamily: Fonts.regular,
    fontSize: 16,
    minHeight: 150,
    width: '90%',
    alignSelf: 'center',
    marginTop: 30,
    paddingBottom: 15,
  },
  viewStyle: {
    flexDirection: 'row',
    // width: '100%',
    justifyContent: 'space-evenly',
    marginTop: heightDimen(10),
    height: heightDimen(50),
    // backgroundColor:'red'
  },
  enableStyle: {
    justifyContent: 'center',
    minHeight: heightDimen(50),
    // borderWidth: 1,
    // borderColor: Colors.lightGrey,
    borderRadius: heightDimen(25),
    backgroundColor: Colors.balanceBoxColor2,
    // opacity: 0.8,
    // width: '100%'
  },
  disableStyle: {
    justifyContent: 'center',
    minHeight: heightDimen(50),
    borderRadius: heightDimen(25),
    width: '100%',
    backgroundColor: '#363636',
    // backgroundColor: 'red',
    // opacity: 0.8,
  },
  textInputView: {
    marginTop: heightDimen(20),
    paddingHorizontal: widthDimen(24),
    marginHorizontal: widthDimen(22),
    borderRadius: heightDimen(12),
  },
  textInput: {
    color: Colors.white,
    height: heightDimen(50),
    fontSize: areaDimen(14),
    fontFamily: Fonts.medium,
    borderRadius: heightDimen(12),
  },
  styleLabelHeader: {
    textAlign: 'left',
    fontSize: areaDimen(30),
    fontFamily: Fonts.semibold,
    color: ThemeManager.colors.textColor,
    marginTop: heightDimen(30),
    marginHorizontal: widthDimen(22),
  },
  btnStyle: {
    width: '100%',
    height: heightDimen(60),
    paddingHorizontal: widthDimen(22),
    marginBottom: heightDimen(20),
  },
  customGrad: {
    borderRadius: heightDimen(30),
  },
});
