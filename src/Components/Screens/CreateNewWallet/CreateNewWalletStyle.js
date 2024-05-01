import { StyleSheet } from 'react-native';
import { Images, Colors, Fonts } from '../../../theme';
import fonts from '../../../theme/Fonts';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';

export const styles = StyleSheet.create({
  mainView: { flex: 1 },
  textInputView: {
    borderWidth: 1,
    alignItems: 'center',
    height: areaDimen(50),
    marginTop: heightDimen(10),
    borderRadius: areaDimen(25),
    justifyContent: 'center',
    paddingHorizontal: widthDimen(24),
    marginHorizontal: widthDimen(22),
  },
  textInput: {
    width: '100%',
    height: '100%',
    // color: Colors.white,
    // alignSelf: 'center',
    fontSize: areaDimen(14),
    fontFamily: fonts.medium,
    alignSelf: 'flex-start',
    opacity: 0.8,
  },
  textColor: {
    fontSize: 13,
    fontFamily: fonts.semibold,
    color: Colors.white,
    marginTop: 33,
    paddingBottom: 10,
    alignSelf: 'flex-start',
  },
  gradientColorview: {
    height: 55,
    width: 55,
    borderRadius: 12,
    // marginLeft: 4,
    // marginRight: 2,
    marginRight: 16,
    alignSelf: 'center',
  },
  btnView: {
    alignSelf: 'center',
    height: 50,
    width: '100%',
    paddingHorizontal: 25,
    alignSelf: 'center',
    marginBottom: 40,
  },
  btnView2: {
    marginTop: '20%',
    alignSelf: 'center',
    height: 40,
    width: 60,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 7,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    alignSelf: 'center',
    color: Colors.fadetext,
  },
  textView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    alignSelf: 'center',
    paddingTop: 25,
  },

  backTouchable: { marginTop: 44, marginStart: 12, padding: 5 },

  imgBackStyle: { width: 26, height: 26, tintColor: Colors.white },

  txtCreateNewWallet: {
    fontSize: areaDimen(30),
    fontFamily: fonts.semibold,
    marginTop: heightDimen(30),
    alignSelf: 'flex-start',
    textAlign: 'left',
    marginHorizontal: widthDimen(22),
  },

  txtNamingWallet: {
    fontSize: areaDimen(14),
    fontFamily: fonts.regular,
    marginTop: heightDimen(7),
    alignSelf: 'flex-start',
    textAlign: 'left',
    lineHeight: heightDimen(22),
    marginHorizontal: widthDimen(22),
  },

  txtNameWallet: {
    fontSize: areaDimen(14),
    fontFamily: fonts.medium,
    color: Colors.white,
    marginTop: heightDimen(20),
    alignSelf: 'flex-start',
    paddingHorizontal: widthDimen(22),
  },
  img: { width: 20, height: 20, resizeMode: 'contain' },
  btnStyle: {
    width: '100%',
    height: heightDimen(60),
    paddingHorizontal: widthDimen(22),
    marginBottom:heightDimen(10),
  },
  customGradient: {
    borderRadius: heightDimen(30),
  },

});
