import { StyleSheet } from 'react-native';
import { Colors, Fonts } from '../../../theme';
import { windowWidth } from '../../../Constant';
import { ThemeManager } from '../../../../ThemeManager';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  qrCode_wrap: {
    justifyContent: 'center',
    // alignItems: 'center',
    paddingVertical: 30,
  },
  Number: {
    color: ThemeManager.colors.textColor,
    fontSize: 20,
    fontFamily:Fonts.regular
},
  qrCode_holder: {
    height: 160,
    width: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginTop:20
  },
  innerContainer: {
    flex: 1,
    borderTopEndRadius: 30,
    width: '100%',
    // height: '100%',
    // paddingHorizontal: 30,
    // justifyContent: 'center'
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
    fontSize: 15,
    color: Colors.buttonColor5,
    fontFamily: Fonts.regular,
  },
  publicAddressWrapStyle: {
    marginTop: 20,
    alignItems: 'center',
  },
  publicAddressStyle: {
    // color: Colors.white,
    marginTop: 11,
    fontFamily: Fonts.light,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
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
    // borderColor: Colors.buttonColor5,
    alignSelf: 'center',
    height: 38,
    minWidth: 100,
    borderRadius: 12,
    justifyContent: 'center',
    marginTop: 20,
    // borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  imgCopyInside: {
    height: 24,
    width: 24,
  },

  btnStyle: {
    width: '100%',
    height: 50,
    paddingHorizontal: 32,
    marginTop: 20,
  },

  customGrad: {
    borderRadius: 12,
  },
});
