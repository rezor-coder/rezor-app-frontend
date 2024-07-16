import {StyleSheet} from 'react-native';
import {Images, Colors, Fonts} from '../../../theme';
import {areaDimen, heightDimen, widthDimen} from '../../../Utils/themeUtils';

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
    backgroundColor: Colors.pink,
    padding: 6,
    borderRadius: 25,
  },
  imgViewStyle: {
    borderRadius: 25,
    height: widthDimen(38),
    width: widthDimen(38),
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadowImageStyle: {
    height: widthDimen(38),
    width: widthDimen(38),
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgStyle: {
    height: widthDimen(14),
    width: widthDimen(14),
    position: 'absolute',
  },
  infoIconStyle: {
    height: widthDimen(16),
    width: widthDimen(16),
    resizeMode:'contain'
  },
  deleteIconStyle: {
    height: widthDimen(18),
    width: widthDimen(16),
  },
  imgStyledlt: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    height: 38,
    width: 38,
  },

  // **************Modal Style ************************
  centeredView: {
    flex: 1,
    // justifyContent: 'center'
  },
  viewGas: {
    flex: 1,
    backgroundColor: Colors.screenBg,
    // paddingTop: 40,
    justifyContent: 'center',
  },
  labelTextStyle: {
    fontFamily: Fonts.medium,
    fontSize: areaDimen(16),
    color: Colors.labelTextStyle,
    marginHorizontal: 15,
  },
  buttonStylesSubmit: {
    paddingHorizontal: 16,
    marginTop: 30,
  },
  itemStyle: {
    paddingHorizontal: widthDimen(22),
    paddingTop: heightDimen(16),
    paddingBottom:heightDimen(6),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // borderBottomWidth: 1,
  },
  btnStyle: {
    width: '100%',
    height: heightDimen(60),
    marginTop: heightDimen(20),
    paddingHorizontal: widthDimen(22),
    marginBottom: heightDimen(20),
    // borderRadius: 14,
  },
  customGrad: {
    borderRadius: heightDimen(30),
  },
});
