import { StyleSheet } from 'react-native';
import { Colors } from '../../../theme';
import { windowWidth } from '../../../Constant';
import { areaDimen, heightDimen } from '../../../Utils/themeUtils';
import fonts from '../../../theme/Fonts';

export default StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    alignItems: 'center',
    // backgroundColor: Colors.black
  },
  upperTextWrapStyle: {
    // marginTop: 20,
    alignItems: 'center',
  },
  textSimple: {
    fontFamily: fonts.regular,
    fontSize: areaDimen(14),
    color: Colors.languageItem,
    lineHeight: heightDimen(21)
  },
  signupText: {
    fontSize: 22,
    color: Colors.buttonColor1,
  },
  forgotPassText: {
    fontSize: areaDimen(14),
    fontFamily: fonts.medium,
    color: Colors.languageItem,
    // alignSelf: 'flex-end',
  },
  attachStatementText: {
    fontFamily: fonts.medium,
    fontSize: areaDimen(14),
  },
  iconStyle: {
    position: 'absolute',
    width: 22,
    height: 22,
    resizeMode: 'contain',
    top: 43,
    left: '70%',
  },
  btnStyle: {
    width: windowWidth * 0.8,
    height: 50,
    marginTop: '15%',
  },
});
