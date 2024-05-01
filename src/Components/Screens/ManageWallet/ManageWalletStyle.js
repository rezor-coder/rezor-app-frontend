import { StyleSheet, Dimensions } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Colors, Fonts } from '../../../theme';
import { heightDimen, widthDimen } from '../../../Utils/themeUtils';

export default StyleSheet.create({
  searchIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    // top: 13,
    // left: '90%',
    alignSelf: 'center',
  },
  imgstyle: {
    position: 'absolute',
    width: widthDimen(30),
    height: heightDimen(44),
    resizeMode: 'contain',
    justifyContent: 'center',
    right: widthDimen(10),
    zIndex: 2
  },
  charaterimg: {
    height: widthDimen(38),
    width: widthDimen(38),
    backgroundColor: Colors.buttonColor2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginRight: widthDimen(12),
  },
  searchBarWrap: {
    marginTop: heightDimen(24),
    marginBottom: heightDimen(15),
    paddingHorizontal: widthDimen(22),
  },
  btnStyle: {
    // position: 'absolute',
    width: '88%',
    height: heightDimen(60),
    // bottom: '5%',
    alignSelf: 'center',
    marginVertical: heightDimen(16)
    // zIndex: 200,
  },
  customGrad: {
    borderRadius: heightDimen(30)
  },
  gradientStyle: {
    width: '90%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 50,
  },

  blockChainWrap: {
    flex: 1,
    // marginTop: 10,
    width: '100%',
    // height: '100%',
    // backgroundColor: Colors.Darkbg,
    // paddingTop: 20
  },
  coinListWrapStyle: {
    flexGrow: 1,
    // marginTop: 15,
    paddingBottom: 100,
    paddingHorizontal: 5,
  },
  coinsListStyle: {
    flex: 1,
    // borderTopWidth: 1,
    // borderColor: '#1D1D1B',
    flexDirection: 'row',
    paddingVertical: heightDimen(14),
    marginVertical: heightDimen(5),
    alignItems: 'center',
    // paddingHorizontal: 20,
    justifyContent: 'space-between',
    marginHorizontal: widthDimen(15),
    paddingStart: widthDimen(11),
    paddingEnd: widthDimen(4),
    borderRadius: heightDimen(12),
    shadowColor:ThemeManager.colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.05,
    elevation: 4,
  },
  coinStyle: {
    height: widthDimen(38),
    width: widthDimen(38),
    marginRight: widthDimen(12),
    borderRadius: 25,
  },
  searchIcon1: {
    tintColor: Colors.fadeDot,
    // position: 'absolute',
    width: 18,
    height: 18,
    resizeMode: 'contain',
    // top: 13,
    // left: '90%',
    alignSelf: 'center',
  },
  NoDataStyle: {
    height: Dimensions.get('screen').height / 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  NoDataStyle1: {
    // justifyContent: 'center',
    // alignItems: 'center',
    position: 'absolute',
    bottom: 55,
    backgroundColor: 'pink',
    flex: 2,
  },
  NoDataTextStyle: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.fadetext,
    textAlign: 'center',
  },

  leftImgStyle: { tintColor: Colors.White },
 
});
