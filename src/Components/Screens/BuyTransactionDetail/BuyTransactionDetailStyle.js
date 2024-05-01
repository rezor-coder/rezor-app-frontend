import {StyleSheet} from 'react-native';
import {Fonts, Colors} from '../../../theme';

export default StyleSheet.create({
  mainView: {
    flex: 1,
    paddingHorizontal: 10,
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
  ImgStye2: {margin: 4, height: 18, width: 18},
  ImgTintStyle: {tintColor: 'green', height: 18, width: 18},

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
    borderColor: Colors.headerBg,
    borderRadius: 10,
    marginTop: 20,
    backgroundColor: Colors.headerBg,
    marginHorizontal: 5,
    // justifyContent: 'center',
    paddingVertical: 20,
  },
  screenStyle: {
    flex: 1,
  },

  textStyle: {
    fontSize: 16,
    color: Colors.activeText,
    fontFamily: Fonts.regular,
    marginTop: 10,
  },

  newtextStyle: {
    marginLeft: 20,
    marginRight: 20,
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: Colors.activeText,
    marginTop: 5
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
    marginBottom: 10,
  },

  bottomTextStyle: {
    fontSize: 19,
    fontFamily: Fonts.regular,
    color: Colors.activeText,
  },
});
