import { StyleSheet } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Colors, Fonts } from '../../../theme';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';

export default StyleSheet.create({
  balanceView: { width: 100, marginRight: 3 },
  card: {
    // backgroundColor: Colors.inputDarkbg,
    // borderRadius: 10,
    resizeMode: 'contain',
    // marginVertical: 2,
    // borderBottomColor: Colors.borderColor,
    // borderBottomWidth: 0.2,
    marginLeft: widthDimen(14),
    marginRight: widthDimen(10)
  },
  imageViewStyle: {
    borderRadius: widthDimen(20),
    height: widthDimen(38),
    width: widthDimen(38),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: heightDimen(12),
    backgroundColor: 'transparent'
  },
  imageViewSocialMediaStyle: {
    // borderRadius: 25,
    height: widthDimen(38),
    width: widthDimen(38),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: heightDimen(10)
  },
  img: { width: widthDimen(15), height: widthDimen(15), resizeMode: 'contain' },
  leftImgStyle: { tintColor: Colors.White },
  rightImgStyle: { tintColor: Colors.White },
  textStyle: {
    fontSize: areaDimen(16),
    fontFamily: Fonts.semibold,
    marginLeft: widthDimen(22),
    marginBottom: heightDimen(4),
    marginTop: heightDimen(10)
  },
  logoutBtnStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: widthDimen(5),
    marginHorizontal: widthDimen(22),
    height: heightDimen(50),
  },
  titleLogoutStyle: {
    fontFamily: Fonts.medium,
    fontSize: areaDimen(14),
  },
  logoutIconStyle: { height: widthDimen(17), width: widthDimen(17), marginRight: widthDimen(8) },
  btnStyle: {
    width: '100%',
    height: 50,
    marginTop: 20,
    paddingHorizontal: 20,
    marginVertical: 30,
  },
  networkBtnStyle:{
    width: '100%',
    flexDirection: 'row',
    paddingVertical: heightDimen(20),
    alignItems: 'center',
    alignSelf: 'center',
    paddingLeft: widthDimen(15),
    justifyContent:'space-between',
  },
  imgstyle: {
    alignSelf: 'center',
    height: heightDimen(40),
    width: widthDimen(40),
    borderRadius: 30
  },
  networkTextStyle: {
    lineHeight: areaDimen(19),
    marginLeft: widthDimen(12),
    fontSize: areaDimen(16),
    fontFamily: Fonts.medium,
    textAlign: 'center',
  },
  arwImg: {
    height: areaDimen(10),
    width: areaDimen(10.6),
    resizeMode: 'contain',
    marginRight:10
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flex: 1,
  },
  centeredView:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, .5)',
  },
  centeredView1: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});
