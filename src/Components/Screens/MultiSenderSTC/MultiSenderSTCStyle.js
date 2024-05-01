import { StyleSheet, Dimensions } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Images, Colors, Fonts } from '../../../theme';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';

export default StyleSheet.create({
  multiSendText: {
    fontFamily: Fonts.medium,
    fontSize: areaDimen(14),
    color: Colors.mnemonicTextStyle,
    textAlign: 'left',
    marginTop: heightDimen(24),
    marginLeft: widthDimen(22),
  },
  step_list: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: widthDimen(22),
    marginTop: heightDimen(16),
  },
  step_Item: {
    alignItems: 'center',
    // backgroundColor: 'green',
    width: "33.3%",
    overflow: 'hidden',
  },
  step_item_title_view: {
    height: widthDimen(22), width: widthDimen(22),
    alignItems: 'center', justifyContent: 'center',
    borderRadius: widthDimen(11)
  },
  step_item_title: {
    fontFamily: Fonts.semibold,
    fontSize: areaDimen(14),
    color: Colors.addressInputPlaceholder,
  },
  step_item_text: {
    fontFamily: Fonts.medium,
    fontSize: areaDimen(12),
    color: Colors.addressInputPlaceholder,
    marginTop: areaDimen(6)
  },
  feeWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: widthDimen(16),
  },
  labelTextStyle: {
    fontFamily: Fonts.regular,
    color: Colors.modalLable,
    fontSize: 14,
    marginTop: 30,
  },
  labelTextStyle1: {
    fontFamily: Fonts.regular,
    fontSize: areaDimen(14),
    color: Colors.labelTextStyle,
  },
  transaction__options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: widthDimen(22),
    marginBottom: heightDimen(10),
    marginTop: heightDimen(30),
  },
  transaction_textStye: {
    fontFamily: Fonts.medium,
    fontSize: areaDimen(14),
    color: Colors.labelTextStyle,
  },
  uploadCSVText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    // color: Colors.White,
    color: ThemeManager.colors.textColor,
  },
  buttonStyle: {
    paddingHorizontal: widthDimen(22),
    paddingTop: heightDimen(100),
  },
  recipients_title_style: {
    fontFamily: Fonts.semibold,
    fontSize: areaDimen(16),
    color: Colors.labelTextStyle,
  },
  recipients_address_style: {
    fontFamily: Fonts.regular,
    fontSize: areaDimen(14),
    color: ThemeManager.colors.lightTextColor,
    marginTop: heightDimen(6),
    width: widthDimen(200)
  },
  recipients_moreTextStyle: {
    fontFamily: Fonts.semibold,
    fontSize: areaDimen(12),
    color: Colors.primaryColor,
  },
  transaction_adoptoin: {
    height: 33,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transaction_TextOptoin: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.labelTextStyle,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    // paddingTop: 22
  },
  viewGas: { flex: 0.5, backgroundColor: 'black', paddingTop: 40 },
  buttonStylesSubmit: {
    paddingHorizontal: 16,
    marginTop: 30,
  },
  // *******************Pin Modal *****************
  pinRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
  },
  indicatorWrapStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 70,
  },
  enterPinWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 55,
  },
  enterPinTextStyle: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.digitTextColor,
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
    color: '#fff',
  },
  transactionFeeTextFieldStyle: {
    borderWidth: 1,
    borderRadius: heightDimen(25),
    marginHorizontal: widthDimen(22),
  },
  btnStyle: {
    justifyContent: 'flex-end',
    width: '100%',
    height: heightDimen(60),
    marginTop: heightDimen(40),
  },

  customGrad: {
    borderRadius: heightDimen(30)
  },
  cancelBtnStyle: {
    width: '100%',
    height: heightDimen(60),
    marginTop: heightDimen(16),
  },
  viewStatusStyle: {
    height: heightDimen(17),
    width: widthDimen(120),
    position: 'absolute',
    marginTop: heightDimen(-5),
    borderColor: ThemeManager.colors.viewBorderColor,
    borderWidth: 1,
    // borderBottomColor: ThemeManager.colors.borderColor,
    // borderBottomWidth: 2,
    left: widthDimen(20),
    borderStyle:'dashed'
  },
  viewStatusDottedStyle: {
    height: heightDimen(17),
    width: widthDimen(120),
    position: 'absolute',
    marginTop: heightDimen(-5),
    borderColor: ThemeManager.colors.viewBorderColor,
    borderWidth: 1,
    // borderBottomColor: ThemeManager.colors.borderColor,
    // borderBottomWidth: 2,
    borderStyle: 'dashed',
    left: widthDimen(20),
  },
  iconImageStyle: {
    height: widthDimen(26),
    width: widthDimen(26),
    marginRight: widthDimen(8),
    marginLeft: widthDimen(-4)
  },
  balanceLabelStyle: {
    fontFamily: Fonts.regular,
    fontSize: areaDimen(14),
    color: Colors.labelTextStyle,
  },
  balanceValueStyle: {
    fontFamily: Fonts.semibold,
    fontSize: areaDimen(20),
    marginLeft: widthDimen(1),
    marginTop: heightDimen(8),
    color: Colors.White,
  },

});
