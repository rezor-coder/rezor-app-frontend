import { StyleSheet } from 'react-native';
import { Fonts, Colors } from '../../../theme';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';

export default StyleSheet.create({
  mainView: {
    flex: 1,
    paddingHorizontal: widthDimen(22),
    // backgroundColor: Colors.black
  },
  statusStyle: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginTop: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 40,
  },
  cardTextStyle: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    // marginTop: 20,
  },
  viewStyle: {
    // flexDirection: 'row',
    paddingHorizontal: 10,
    marginTop: 20,
    marginLeft: 15,
    // flexWrap: 'wrap',
  },

  ImgStyle: {
    alignSelf: 'center',
    marginRight: 10,
    height: 20,
    width: 20,
  },
  ImgStye2: { marginTop: 4, height: 38, width: 38 },
  ImgTintStyle: { tintColor: 'green', height: 18, width: 18 },

  bottomview: {
    backgroundColor: Colors.activeText,
    marginBottom: 20,
  },
  headerStyle: {
    paddingTop: 25,
    paddingBottom: 28,
    marginHorizontal: 20,
    flexDirection: 'row',
  },
  titleStyle: {
    fontFamily: Fonts.regular,
    fontSize: 24,
    color: Colors.activeText,
    marginLeft: 13,
    alignSelf: 'center',
  },
  cardStyle: {
    borderWidth: 1,
    flex: 1,
    backgroundColor: Colors.activeText,
    borderColor: Colors.activeText,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
  },

  cardStyleNew: {
    // borderWidth: 1,
    // borderColor: Colors.headerBg,
    borderRadius: 10,
    marginTop: 20,
    // backgroundColor: Colors.headerBg,
    marginHorizontal: 5,
    // justifyContent: 'center',
    paddingVertical: 20,
  },
  screenStyle: {
    flex: 1,
  },

  textStyle: {
    fontSize: areaDimen(15),
    color: Colors.activeText,
    fontFamily: Fonts.medium,
    marginTop: heightDimen(20),
  },

  newtextStyle: {
    marginLeft: widthDimen(20),
    marginRight: widthDimen(20),
    fontFamily: Fonts.regular,
    fontSize: areaDimen(14),
    color: Colors.activeText,

  },

  addressTextStyle: {
    color: Colors.activeText,
    fontSize: 15,
    fontFamily: Fonts.regular,
    width: '80%',
  },

  greentextStyle: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    // color: Colors.textGreen,
    marginLeft: 5,
  },

  bottomView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignSelf: 'center',
    marginBottom: heightDimen(10),
    width: '100%'
  },

  bottomTextStyle: {
    fontSize: areaDimen(18),
    fontFamily: Fonts.regular,
    color: Colors.activeText,
  },
  btnViewStyle: { height: 50, justifyContent: 'center' },
  titleTextStyle: {
    fontSize: areaDimen(14),
    fontFamily: Fonts.medium,
  },
  amountTextStyle: {
    fontSize: areaDimen(14),
    fontFamily: Fonts.medium,
  },
  mediumTextStyle: {
    fontSize: areaDimen(14),
    fontFamily: Fonts.medium,
  },

  amountDollarTextStyle: {
    fontSize: areaDimen(14),
    fontFamily: Fonts.medium,
  },
  btnStyle: {
    width: '100%',
    height: heightDimen(60),
  },
  customGrad: {
    borderRadius: heightDimen(30),
  },
});
