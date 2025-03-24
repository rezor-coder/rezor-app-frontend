import {StyleSheet} from 'react-native';
import {ThemeManager} from '../../../../ThemeManager';
import {Colors} from '../../../theme';
import fonts from '../../../theme/Fonts';
import {areaDimen, heightDimen, widthDimen} from '../../../Utils/themeUtils';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  containerStyle: {
    // marginTop: heightDimen(70),
    // paddingHorizontal: widthDimen(20)
  },
  containerScroll: {
    flex: 1,
    // backgroundColor:Colors.black
  },
  languageItemWrapStyle: {
    // borderColor: Colors.languageItem,
    borderWidth: 1,
    borderRadius: areaDimen(30),
    // marginTop: heightDimen(10),
    flexDirection: 'row',
    width: widthDimen(318), //'80%',
    height: heightDimen(60),
    padding: areaDimen(5),
    alignItems: 'center',
    // marginLeft:56,
    // shadowOffset: {
    //     width: 0,
    //     height: 3,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 3.05,
    // elevation: 4,
    paddingHorizontal: widthDimen(24),
    marginTop: widthDimen(70),
    justifyContent: 'space-between',
  },
  languageItemStyle: {
    fontSize: areaDimen(14),
    // color: Colors.languageItem,
    fontFamily: fonts.medium,
  },
  btnStyle: {
    width: '100%',
    marginTop: heightDimen(20),
    paddingHorizontal: widthDimen(22),
    marginBottom: heightDimen(10),
  },

  headerStyle: {
    color: ThemeManager.colors.primary,
    fontSize: widthDimen(36),
    fontWeight: 600,
    fontFamily: fonts.inter,
    // lineHeight: areaDimen(37)
    textAlign: 'center',
    marginTop: heightDimen(68),
    marginHorizontal: widthDimen(35),
  },

  BYsaita: {
    height: heightDimen(70),
    width: 'auto',

    resizeMode: 'contain',

    alignSelf: 'center',
  },

  lablePrefLang: {
    color: Colors.lightGrey3,
    fontSize: widthDimen(14),
    fontFamily: fonts.inter,
    fontWeight: 400,
    // lineHeight: heightDimen(18),
    textAlign: 'left',
    marginTop: heightDimen(8),
    // marginBottom: heightDimen(10)
  },

  imgFlag: {width: areaDimen(20), height: areaDimen(20), marginEnd: 5},

  customGrad: {
    borderRadius: areaDimen(100),
    marginBottom: heightDimen(10),
  },
  bgViewStyle: {flex: 1},
  gradientStyle: {flex: 1},
  bgImageStyle: {
    width: '95%',
    height: heightDimen(514),
    position: 'absolute',
    top: '-1%',
  },
  welcomeIconStyle: {
    width: widthDimen(240),
    height: heightDimen(197),
    alignSelf: 'center',
  },
  bottomImageStyle: {
    width: widthDimen(108),
    height: widthDimen(20),
    marginTop: heightDimen(46),
  },
  securityIconStyle: {
    width: widthDimen(60),
    height: heightDimen(60),
    marginTop: '10%',
    marginLeft: '65%',
  },
  biometricIconStyle: {
    width: widthDimen(62),
    height: heightDimen(62),
    marginRight: '70%',
  },
});
