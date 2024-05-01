import { StyleSheet, Dimensions } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Images, Colors, Fonts } from '../../../theme';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';

export default StyleSheet.create({
  multiSendText: {
    fontFamily: Fonts.medium,
    fontSize: areaDimen(14),
    // color: Colors.white,
    color: ThemeManager.colors.textColor,
    textAlign: 'left',
    marginTop: heightDimen(24),
    marginLeft: widthDimen(22),
  },
  // step_list: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   paddingHorizontal: 23,
  //   marginTop: 23,
  //   marginBottom: 20,
  // },
  balanceLabelStyle: {
    fontFamily: Fonts.medium,
    fontSize: areaDimen(14),
    color: ThemeManager.colors.textColor,
  },
  balanceValueStyle: {
    fontFamily: Fonts.semibold,
    fontSize: areaDimen(14),
  },
  // step_Item: {
  //   alignItems: 'center',
  // },
  // step_item_title: {
  //   fontFamily: Fonts.bold,
  //   fontSize: 24,
  //   // color: Colors.white,
  //   color: ThemeManager.colors.textColor,
  // },
  // step_item_text: {
  //   fontFamily: Fonts.regular,
  //   fontSize: 12,
  //   // color: Colors.white,
  //   color: ThemeManager.colors.textColor,
  // },
  labelTextStyle: {
    fontFamily: Fonts.regular,
    color: Colors.languageHeader,
    fontSize: 14,
    marginTop: 30,
  },
  downloadCSVText: {
    marginTop: heightDimen(20),
    fontFamily: Fonts.medium,
    fontSize: areaDimen(16),
    // fontWeight: '500',
  },
  uploadCSVText: {
    marginTop: heightDimen(8),
    fontFamily: Fonts.medium,
    fontSize: areaDimen(14),
    // fontWeight: '500',
  },
  buttonStyle: {
    paddingHorizontal: widthDimen(22),
    paddingBottom: heightDimen(20),
    backgroundColor: 'transparent',
  },

  searchBarStyle: {
    backgroundColor: Colors.headerBg,
    paddingTop: 20,
  },
  dappimgStyle: {
    resizeMode: 'contain',
    borderRadius: 40,
    height: 70,
    width: 70,
  },
  inputStyle: {
    paddingLeft: 55,
    backgroundColor: Colors.searchBoxbg,
  },
  dappStyle: {
    width: '100%',
  },
  titleStyle: {
    fontSize: 12,
  },
  wrapStyle: {
    flexDirection: 'column',
    // paddingVertical: 10,
    justifyContent: 'flex-start',
    marginHorizontal: 12,
    width: Dimensions.get('window').width / 5.5,
  },
  dapp_iconStyle: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  noItemStyle: {
    height: 130,
    width: '80%',
    borderRadius: 10,
    backgroundColor: Colors.headerBg,
    alignSelf: 'center',
    alignItems: 'center',
  },
  dapp_InfoStyle: {
    flex: 1,
  },
  dappTextStyle: {
    color: Colors.mnemonicTextStyle,
    fontFamily: Fonts.regular,
    fontSize: 16,
    opacity: 0.6,
    marginLeft: 12,
    marginTop: 14,
  },
  chatName: {
    borderRadius: 40,
    height: 68,
    width: 68,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primaryColor,
  },
  chatNameTextStyle: {
    fontFamily: Fonts.semibold,
    fontSize: 19,
    // color: Colors.White,
    color: ThemeManager.colors.textColor,
  },
  titleStyle: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.createWalletTitle,
    marginBottom: 2,
    marginTop: 2,
    textAlign: 'center',
    // marginLeft: 10
    // textAlign: 'center'
  },
  subtitleStyle: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textStyle,
    lineHeight: 18,
  },
  container: {
    flex: 1,
  },
  pagerView: {
    flex: 1,
  },
  chartWrap: {
    position: 'relative',
  },
  chartSwitchBtn_style: {
    position: 'absolute',
    zIndex: 10,
    top: 20,
    left: '90%',
  },
  pieChart_View: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  lineChart_View: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  inputStyle: {
    borderWidth: 1,
    borderColor: Colors.modalInputStyle,
  },
  modalBtnRow: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    marginBottom: 16,
  },
  btnCancelStyle: {
    flex: 1,
    marginRight: 5,
    backgroundColor: Colors.buttonSecondary,
    borderColor: Colors.buttonSecondary,
  },
  btnConfirmStyle: {
    flex: 1,
    marginLeft: 5,
  },
  yourProfileTitle: {
    fontFamily: Fonts.light,
    fontSize: 30,
    // color: Colors.White,
    color: ThemeManager.colors.textColor,
    lineHeight: 29,
  },
  yourProfileText: {
    fontFamily: Fonts.regular,
    color: Colors.textStyle,
    fontSize: 15,
    lineHeight: 24,
  },
  connectExchangeHd: {
    padding: 16,
  },
  connectExhangeTextStyle: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    // color: Colors.White,
    color: ThemeManager.colors.textColor,
  },
  exchangeListStyle: {
    paddingLeft: 16,
  },
  addCoinWrap: {
    borderTopWidth: 1,
    borderColor: Colors.exchangeBorder,
    marginTop: 15,
    padding: 16,
  },
  addCoinTitleStyle: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    // color: Colors.White,
    color: ThemeManager.colors.textColor,
  },
  searchBoxStyle: {
    paddingLeft: 0,
    paddingRight: 0,
    marginTop: 15,
  },
  searchinputStyle: {
    backgroundColor: Colors.searchBoxbg,
    paddingLeft: 55,
  },
  searchIconStyle: {
    position: 'absolute',
    top: -33,
    left: 25,
  },
  tradeTransactionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tradeTransactionButtons__buy: {
    flex: 1,
    marginRight: 8,
  },
  tradeTransactionButtons__transaction: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: Colors.buttonSecondary,
  },
  scrollWrap: {
    paddingTop: 20,
  },
  p2p_infoBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  p2p_infoBlock__left: {
    flex: 1,
    paddingRight: 4,
  },
  p2p_infoBlock__left__title: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    marginBottom: 2,
    // color: Colors.White,
    color: ThemeManager.colors.textColor,
  },
  p2p_infoBlock__left__subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    marginBottom: 4,
    // color: Colors.White,
    color: ThemeManager.colors.textColor,
  },
  p2p_infoBlock__right: {},
  aboutp2p_readmore: {
    paddingHorizontal: 16,
  },
  aboutp2p: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textStyle,
  },
  aboutp2pReadmore: {
    // color: Colors.White,
    color: ThemeManager.colors.textColor,
    fontSize: 12,
    lineHeight: 18,
    position: 'relative',
    marginBottom: -3,
  },
  linkHeadingStyle: {
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.buttonFeeSeprator,
  },
  tradingPair_table_thead: {
    flexDirection: 'row',
    height: 30,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  tradingPair_th: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: Colors.labelTextStyle,
  },
  tradingPair_table_body: {
    flexDirection: 'row',
    height: 30,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  tradingPair_td: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    // color: Colors.White,
    color: ThemeManager.colors.textColor,
  },
  btnTextStyle: {
    fontSize: 15,
    color: ThemeManager.colors.searchTextColor,
    textAlign: 'left',
  },

  rowTextStyle: {
    fontFamily: Fonts.medium,
    fontSize: areaDimen(14),
    color: Colors.lighttxt,
    textAlign: 'left',
  },
  rowStyle: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
    paddingLeft: 20,
  },
  btnStyle: {
    // borderWidth: 2,
    //borderRadius: 12,
    justifyContent: 'flex-end',
    // backgroundColor: ThemeManager.colors.btcBack,
    // borderColor: ThemeManager.colors.btcBack,
    width: '100%',
    // paddingHorizontal: 10,
    height: heightDimen(60),
    marginTop: heightDimen(40),
  },

  customGrad: {
    borderRadius: heightDimen(30)
  },

  rightImgStyle: { tintColor: Colors.White },

  dropdown3BtnChildStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  dropdown3BtnImage: { width: 45, height: 45, resizeMode: 'cover' },
  step_list: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: widthDimen(22),
    marginTop: heightDimen(16),
    // backgroundColor: "red",
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
  viewStatusStyle: {
    height: heightDimen(17),
    width: widthDimen(120),
    position: 'absolute',
    marginTop: heightDimen(-5),
    borderColor: ThemeManager.colors.viewBorderColor,
    borderWidth: heightDimen(1),
    // borderBottomColor: ThemeManager.colors.borderColor,
    // borderBottomWidth: 2,
    left: widthDimen(20),
  },
  viewStatusDottedStyle: {
    height: heightDimen(17),
    width: widthDimen(120),
    position: 'absolute',
    marginTop: heightDimen(-5),
    borderColor: ThemeManager.colors.viewBorderColor,
    borderWidth: heightDimen(1),
    // borderBottomColor: ThemeManager.colors.borderColor,
    // borderBottomWidth: 2,
    borderStyle: 'dashed',
    left: widthDimen(20),
  },
});
