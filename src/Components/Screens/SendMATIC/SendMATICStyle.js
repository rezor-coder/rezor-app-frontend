import { StyleSheet } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Colors, Fonts } from '../../../theme';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';

export default StyleSheet.create({
  roundView: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
  },
  viewGas: { flex: 1, backgroundColor: 'black', paddingTop: 40 },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    // paddingTop: 22
  },
  amountView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amount: {
    // color: Colors.white,
    color: ThemeManager.colors.textColor,
    // alignSelf: 'flex-end',
    marginRight: 10,
  },
  textStyle: {
    color: Colors.darkFade,
    // marginVertical: 15,
   fontFamily:Fonts.medium,
    textAlign: 'right',
  },
  addressOptionsCustom: {
    position: 'relative',
    flexDirection: 'row',
  },
  addressIcon: {
    width: widthDimen(32),
    height: widthDimen(35),
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  cellStyle: {
    borderWidth: 1,
    borderRadius: 12,
    // width: 48,
    // height: 55,
    borderColor: Colors.languageItem,
    marginLeft: 10,
  },

  inputText: {
    fontSize: 20,
    // color: '#fff',
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
  labelTextStyle: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    // color: Colors.labelTextStyle,
  },
  buttonStylesSubmit: {
    paddingHorizontal: 16,
    marginTop: 30,
  },
});
