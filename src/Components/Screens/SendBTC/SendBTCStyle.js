import { StyleSheet } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Colors, Fonts } from '../../../theme';
import { widthDimen, heightDimen, areaDimen } from '../../../Utils/themeUtils';

export default StyleSheet.create({
  roundView: {
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    flex: 1,
  },
  textStyle: {
    color: Colors.darkFade,
    // marginVertical: 15,
 marginHorizontal: 15,
    textAlign: 'right',
  },
  amountView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amount: {
    // color: Colors.white,
    color: ThemeManager.colors.textColor,
    marginRight: 10,
  },
  inputText: {
    fontSize: 20,
    color: '#fff',
  },
  transaction__options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  transaction_textStye: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    // color: Colors.white,
    color: ThemeManager.colors.textColor,
  },
  transaction_adoptoin: {
    height: 33,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transaction_TextOptoin: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    // color: Colors.white,
    color: ThemeManager.colors.textColor,
  },
  centeredView: {
    flex: 1,
    // backgroundColor: 'black',
    // justifyContent: 'center',
    // paddingTop: 22
    paddingHorizontal: 10,
  },
  viewGas: { flex: 1 },
  labelTextStyle: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    marginTop: 30,
  },
  addressOptionsCustom: {
    position: 'relative',
    flexDirection: 'row',
  },
  cellStyle: {
    borderWidth: 1,
    borderRadius: 12,
    // width: 48,
    // height: 55,
    borderColor: Colors.languageItem,
    marginLeft: 10,
  },
  addressIcon: {
    width: widthDimen(32),
    height: widthDimen(35),
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  buttonStylesSubmit: {
    paddingHorizontal: 16,
    marginTop: 30,
  },
});
