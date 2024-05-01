import { StyleSheet } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Images, Colors, Fonts } from '../../../theme';
import fonts from '../../../theme/Fonts';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';

export const styles = StyleSheet.create({
  roundView: {
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    flex: 1,
    // paddingVertical: 30,
  },
  btnStyle: {
    height: 23,
    width: 100,
    marginLeft: 40,
  },
  addWalletView: {
    marginTop: heightDimen(10),
    borderRadius: widthDimen(14),
  },
  addWalletAddressText: {
    fontFamily: fonts.medium,
    fontSize: areaDimen(14)
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
  pastetxt: {
    color: Colors.languageItem,
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
    height: 0.5,
    marginHorizontal: 15,
    width: '95%',
    alignSelf: 'center',
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
  addressIcon: { padding: 15, alignSelf: 'flex-end' },
  imgStyle: { width: 30, height: 30, marginRight: 10 },
  textInputAddress: {
    flex: 1,
    fontSize: areaDimen(14),
    fontFamily: fonts.medium,
    paddingLeft: widthDimen(20),
  },
  walletView: {
    marginTop: heightDimen(16),
    // paddingHorizontal: 10,
  },
  inputBoxStyle: {
    borderWidth: 0,
    fontSize: areaDimen(14),
    fontFamily: fonts.medium,
    borderColor: ThemeManager.colors.inputBorderColor,
  },
  basicView: {
    justifyContent: 'flex-end',
    marginHorizontal: widthDimen(22),
    flex: 1,
  },
  marginView: { marginHorizontal: widthDimen(22) },
  marginSubView: { marginTop: heightDimen(12) },
});
