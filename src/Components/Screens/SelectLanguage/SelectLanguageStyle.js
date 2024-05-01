import { StyleSheet } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Colors } from '../../../theme';
import fonts from '../../../theme/Fonts';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  containerStyle: {
    marginTop: heightDimen(70),
    paddingHorizontal: widthDimen(20)
  },
  containerScroll: {
    flex: 1,
    // backgroundColor:Colors.black
  },
  languageItemWrapStyle: {
    backgroundColor: 'white',
    // borderColor: Colors.languageItem,
    borderWidth: areaDimen(1),
    borderRadius: areaDimen(33),
    marginTop: heightDimen(10),
    flexDirection: 'row',
    width: '100%',
    height: heightDimen(66),
    padding: areaDimen(10),
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.05,
    elevation: 4,
    paddingHorizontal: widthDimen(16)
  },
  languageItemStyle: {
    fontSize: areaDimen(16),
    color: Colors.languageItem,
    fontFamily: fonts.semibold,
    marginLeft: widthDimen(12)
  },
  btnStyle: {
    width: '100%',
    marginTop: heightDimen(20),
    paddingHorizontal: widthDimen(22),
    marginBottom: heightDimen(20),
  },

  headerStyle: {
    color: ThemeManager.colors.primary,
    fontSize: areaDimen(30),
    fontFamily: fonts.semibold,
    // lineHeight: areaDimen(37)
  },

  BYsaita: {
    height: heightDimen(70),
    width: 'auto',

    resizeMode: 'contain',

    alignSelf: 'center',
  },

  lablePrefLang: {
    color: Colors.lightGrey3,
    fontSize: areaDimen(14),
    fontFamily: fonts.regular,
    // lineHeight: heightDimen(18),
    textAlign: 'left',
    marginTop: heightDimen(8),
    marginBottom: heightDimen(10)
  },

  imgFlag: { width: areaDimen(20), height: areaDimen(20), marginEnd: 5 },

  customGrad: {
    borderRadius: areaDimen(100),
    marginBottom: heightDimen(10),
  },
});
