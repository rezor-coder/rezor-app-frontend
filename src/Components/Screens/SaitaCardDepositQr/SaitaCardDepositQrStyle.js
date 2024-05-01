import { StyleSheet } from 'react-native';
import { Colors, Fonts } from '../../../theme';
import { windowWidth } from '../../../Constant';
import { ThemeManager } from '../../../../ThemeManager';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  qrCode_wrap: {
    justifyContent: 'center',
    paddingTop: heightDimen(20),
  },
  qrCode_holder: {
    height: heightDimen(286),
    width: widthDimen(276),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius:areaDimen(12),
    marginTop:heightDimen(34),
    position:'relative',
    shadowColor:ThemeManager.colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.05,
    elevation: 4,
  },
  innerContainer: {
    flex: 1,
    borderTopEndRadius: 30,
    width: '100%',
  },
  qrCodeStyle: {
    width: windowWidth * 0.7,
    height: windowWidth * 0.7,
    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: 40,
  },
  valueBoxStyle: {
    flexDirection: 'row',
    paddingHorizontal: '20%',
    marginTop: 30,
  },
  coinPrice: {
    // color: Colors.white,
    color: ThemeManager.colors.textColor,
    fontSize: 25,
    fontFamily: Fonts.regular,
  },
  currencyPrice: {
    fontSize: 28,
    color: Colors.lightGrey,
    fontFamily: Fonts.regular,
  },
  publicAddressText: {
    fontSize: areaDimen(16),
    color: Colors.buttonColor5,
    fontFamily: Fonts.semibold,
  },
  publicAddressWrapStyle: {
    marginTop: heightDimen(20),
    alignItems: 'center',
  },
  publicAddressStyle: {
    // color: Colors.white,
    marginTop: heightDimen(10),
    fontFamily: Fonts.light,
    fontSize: areaDimen(14),
    textAlign: 'center',
    paddingHorizontal: widthDimen(46),
    lineHeight:heightDimen(18)
  },
  NoteStyle: {
    // color: Colors.white,
    marginTop: 11,
    fontFamily: Fonts.semibold,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  buttonsWrap: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 70,
    justifyContent: 'center',
  },
  button: {
    flex: 3,
    backgroundColor: Colors.buttonsBg,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.languageItem,
    fontSize: 16,
    fontFamily: Fonts.regular,
  },
  button: {
    flex: 3,
    backgroundColor: Colors.buttonsBg,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.languageItem,
    fontSize: 16,
  },
  midButton: {
    marginHorizontal: '1%',
  },
  modalContainer: {
    borderRadius: 12,
    position: 'absolute',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '80%',
    left: '10%',
    top: '30%',
  },
  modalHeader: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 30,
    backgroundColor: Colors.lightBg,
  },
  modalHeaderText: {
    color: Colors.languageItem,
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: Fonts.regular,
  },
  modalContent: {
    backgroundColor: Colors.modalContentBg,
    padding: 30,
  },
  modalContentHeaderText: {
    color: Colors.languageItem,
  },
  amountInputBox: {
    backgroundColor: Colors.lightBg,
    paddingHorizontal: 10,
    marginTop: 20,
    fontSize: 25,
    textAlign: 'right',
    borderRadius: 8,
    // color: Colors.white,
    color: ThemeManager.colors.textColor,
  },
  doneBtn: {
    marginTop: 20,
    width: '60%',
    marginRight: 'auto',
    marginLeft: 'auto',
  },

  copyBtn: {
    height: areaDimen(44),
    width: areaDimen(44),
    borderRadius:100,
    justifyContent: 'center',
    alignItems: 'center',
  },

  imgCopyInside: {
    height: areaDimen(18),
    width: areaDimen(18),
  },

  btnStyle: {
    width: '100%',
    height: heightDimen(60),
    paddingHorizontal: widthDimen(22),
    marginTop: heightDimen(20),
  },

  customGrad: {
    borderRadius: heightDimen(30),
  },
});
