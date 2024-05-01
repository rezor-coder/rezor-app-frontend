import { StyleSheet } from 'react-native';
import { Images, Colors, Fonts } from '../../../theme';
import fonts from '../../../theme/Fonts';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';

export const styles = StyleSheet.create({
  roundView: {
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    flex: 1,
    // backgroundColor: 'black',
    // paddingVertical: 30,
  },
  marginView: { marginHorizontal: widthDimen(22) },
  marginSubView: { marginTop: heightDimen(12) },
  inputBoxStyle: {
    borderWidth: 0,
    fontSize: areaDimen(14),
    fontFamily: fonts.medium,
  },
  walletView: {
    marginTop: heightDimen(16),
    // paddingHorizontal: 10,
  },
  btnStyle: {
    height: 23,
    width: 100,
    marginLeft: 40,
  },
  addWalletView: {
    // backgroundColor: Colors.inputDarkbg,
    marginTop: 25,
    borderRadius: 4,
  },
  addressView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: heightDimen(50),
    borderRadius: widthDimen(25),
    borderWidth: 1,
    marginTop: heightDimen(10)
  },
  textInputAddress: {
    flex: 1,
    fontSize: areaDimen(14),
    fontFamily: fonts.medium,
    paddingLeft: widthDimen(20),
  },
  pastetxt: {
    color: Colors.fadeDot,
    textAlign: 'center',
  },
  scanView: {
    paddingHorizontal: widthDimen(10),
    alignSelf: 'center',
    height: '100%',
    justifyContent: 'center',
  },
  iconstyle: {
    height: widthDimen(18),
    width: widthDimen(18),
    resizeMode: 'contain',
    tintColor: Colors.languageItem,
  },
  line: {
    backgroundColor: '#000000',
    height: 2,
    alignSelf: 'center',
    marginHorizontal: 15,
    width: 300,
  },
  networkView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: heightDimen(50),
    borderRadius: widthDimen(25),
    borderWidth: 1,
    marginTop: heightDimen(10)
  },
  nettxt: {
    paddingLeft: widthDimen(20),
    fontSize: areaDimen(14),
    fontFamily: fonts.medium,
  },
  downiconview: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  downiconstyle: {
    height: 12,
    width: 12,
    resizeMode: 'contain',
  },
  savebtn: {
    height: heightDimen(50),
    width: '100%',
    alignSelf: 'center',
    marginBottom:'15%'
  },
});
