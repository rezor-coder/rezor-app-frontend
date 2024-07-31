import {StyleSheet} from 'react-native';

import {areaDimen, heightDimen, width,widthDimen} from '../../../../Utils/themeUtils';
import { Colors, Fonts } from '../../../../theme';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingVertical: areaDimen(30),
    paddingHorizontal: areaDimen(22),
  },
  logoStyle: {
    height: heightDimen(32.3),
    width: widthDimen(25.5),
    resizeMode: 'contain',
    transform: [{rotate: '45deg'}],
    tintColor: Colors.buttonColor1,
    marginRight: areaDimen(6),
  },
  loginTextView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: areaDimen(16),
  },
  signUpTitle: {
    fontSize: areaDimen(30),
    fontFamily: Fonts.semibold,
    alignSelf: 'flex-start',
    lineHeight: heightDimen(37),
  },
  codeTextStyle: {
    fontFamily: Fonts.medium,
    fontSize: areaDimen(14),
    lineHeight: heightDimen(18),
    textAlign: 'right',
  },
  buttonView: {
    width: width - 44,
    height: heightDimen(60),
    borderRadius: areaDimen(30),
    alignSelf: 'center',
    marginBottom: areaDimen(32),
  },
  sendcodeView: {alignSelf: 'flex-end', marginTop: areaDimen(16)},
  straproStyle: {
    fontSize: areaDimen(18),
    fontFamily: Fonts.semibold,
    color: Colors.buttonColor1,
    lineHeight: heightDimen(22),
  },
  registerText: {
    textAlign: 'center',
    fontSize: areaDimen(16),
    fontFamily: Fonts.semibold,
    lineHeight: heightDimen(19),
    marginBottom: areaDimen(35),
  },
  iconStyle: {
    height: heightDimen(11),
    width: widthDimen(11),
  },
  inputTextStyle: {
    fontFamily: Fonts.medium,

    fontSize: areaDimen(14),
    // flexGrow: 0.96,
  },
  dialCodeView:{
    left: 5,
    marginRight: 10,
    flexGrow: 0.04,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
export default styles;
