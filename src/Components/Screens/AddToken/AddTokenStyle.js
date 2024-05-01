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
    // backgroundColor: 'black',
    paddingVertical: heightDimen(24),
    paddingHorizontal: widthDimen(22)
  },
  // btnStyle: {
  //   height: 25,
  //   marginVertical: 30,
  //   width: 80,
  //   alignSelf: 'flex-end',
  // },
  addWalletView: {
    backgroundColor: Colors.inputDarkbg,
    marginTop: 25,
    borderRadius: 4,
  },
  pastetxt: {
    color: Colors.fadeDot,
    textAlign: 'center',
  },
  scanView: {
    marginLeft: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: heightDimen(50),
    width: widthDimen(60),
    // backgroundColor: 'red'
  },
  iconstyle: {
    height: heightDimen(14),
    width: widthDimen(18),
    resizeMode: 'contain',
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
    height: 50,
  },
  nettxt: {
    paddingLeft: 20,
    color: Colors.fadeDot,
    fontSize: 16,
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
  },
  btnStyle: {
    borderWidth: 1,
    borderRadius: 12,
    // justifyContent: 'flex-end',
    // backgroundColor: 'transparent',
    // borderWidth: 1,
    // borderColor: Colors.inputDarkbg,
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 20,
    backgroundColor: 'red',
  },
  btnTextStyle: {
    fontSize: 15,
    color: 'white',
    textAlign: 'left',
  },
  dropDownStyle: {
    backgroundColor:"#292929",
    borderRadius: 8,
  },
  rowTextStyle: {
    // fontFamily: fonts.regular,
    fontSize: areaDimen(14),
    fontFamily: fonts.medium,
    // color: Colors.lighttxt,
    textAlign: 'left',
  },
  rowStyle: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
    paddingLeft: 20,
  },

  leftImgStyle: { tintColor: ThemeManager.colors.textColor },

  viewDropdownOuter: {
    marginTop: 25,
    paddingHorizontal: 15,
  },

  txtSelectNetwork: {
    fontFamily: Fonts.semibold,
    fontSize: 13,
  },

  btnStyleDpDown: {
    borderWidth: 1,
    borderRadius: 12,
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 20,
  },

  btnTextStyleDpDown: {
    fontSize: 15,
    textAlign: 'left',
  },

  dpDwonImgRight: { width: widthDimen(10), height: heightDimen(10), },
  viewContractAddress: { marginTop: 25 },

  txtContractAddress: {
    fontFamily: Fonts.medium,
    fontSize: areaDimen(14),
    marginBottom: heightDimen(10)
  },

  inputStyle: {

    width: '100%',
    // marginTop: 14,
  },
  viewSymbolDecimalOuter: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },

  inputSymbol: {
    width: '95%',
    marginRight: '5%'
  },

  styleSymbol: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  inputDecimal: {
    width: '95%',
    marginLeft: '5%',
  },

  styleDecimal: {
    width: '50%',
    justifyContent: 'center',

    alignItems: 'center',
  },

  basicButtonView: { justifyContent: 'flex-end', flex: 1 },
  addressView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: heightDimen(50),
    borderWidth: 1,
    borderRadius: heightDimen(25),
    marginBottom: heightDimen(20),

  },
});
