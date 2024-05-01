import { StyleSheet, Dimensions } from 'react-native';
import { Fonts, Colors } from '../../../theme';

export default StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: Colors.White,
    alignItems: 'center',
  },
  wrapStyle: {
    flex: 1,
  },
  hideBtn: {
    opacity: 0,
    position: 'relative',
    zIndex: -10,
  },
  centeredView: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    flex: 1,
    justifyContent: 'center',
    // paddingHorizontal: 18,
  },
  tabsWrap: {
    backgroundColor: 'rgba(0,0,0,0)',
    borderColor: '#fff',
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 14,
    color: Colors.textColor,
    marginBottom: 15,
    alignSelf: "center",
    marginTop: 8
  },
  orderBlock: {
    flex: 1,
    position: 'relative',
  },
  navBarBg: {
    width: '100%',
    backgroundColor: Colors.White,
  },
  navTextStyle: {
    fontFamily: Fonts.osRegular,
    fontSize: 16,
    color: Colors.textLight,
  },
  activeTextStyle: {
    fontFamily: Fonts.osSemibold,
    fontSize: 16,
    color: Colors.textLink,
  },
  activeTabStyle: {
    backgroundColor: Colors.White,
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.White,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.White,
    paddingHorizontal: 20,
    paddingVertical: 25,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.84,
    elevation: 5,
    width: '85%',
  },
  modalView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.black,
    opacity: 0.94,
  },
  modalinner: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.white,
    paddingHorizontal: 15,
    paddingVertical: 20,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.84,
    elevation: 2,
    width: '85%',
  },
  vwSignTransaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 40,
    marginBottom: 8,
  },
  titleSign: {
    fontFamily: Fonts.bold,
    fontSize: 17,
  },
  textLbl: {
    fontFamily: Fonts.semibold,
    fontSize: 15,
    paddingRight:5,

  },
  txtValue: {
    width: '75%',
    fontFamily: Fonts.regular,
    fontSize: 15,
  },
  enabledFessStyle: {
    fontSize: 14,
    fontFamily: Fonts.semibold,
    color: Colors.white,
  },
  enabledFessvalueStyle: {
    fontSize: 11,
    fontFamily: Fonts.semibold,
    color: Colors.white,
  },

  disabledFessStyle: {
    fontSize: 14,
    fontFamily: Fonts.semibold,
    color: Colors.black,
  },

  disabledFessvalueStyle: {
    fontSize: 11,
    fontFamily: Fonts.semibold,
    color: Colors.black,
  },

  mainFeeView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 8,
    marginBottom: 14,
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
    borderColor: '#E6E6E6',
    backgroundColor: '#E6E6E6',
  },
  feeStyle: {
    marginTop: 35,
    flexDirection: 'row',
    marginHorizontal: 26,
    justifyContent: 'space-between',
  },

  feeslowStyle: {
    paddingVertical: 8,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    width: '33%',
    paddingLeft: 12,
  },

  mainViewLoader: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'rgba(52, 52, 52, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  dropdown: {
    position: "absolute",
    backgroundColor: "white",
    alignSelf: "center",
    paddingHorizontal: 20,
    top: -30,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 1,
  },
  searchBtn: {
    // position: 'absolute',
    // right: 10,
    // bottom: 10,
    // backgroundColor: 'red',
    padding: 8
    // top: 5
  },
  viewGas: { flex: 1, backgroundColor: 'black', paddingTop: 40 },
  buttonStylesSubmit: {
    paddingHorizontal: 16,
    marginTop: 30

  },
  modalVieww: {
    marginHorizontal: 20,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,

  },
  headerView: { flexDirection: 'column', alignItems: 'center', width: '100%', paddingTop: 10, paddingBottom: 5 },
  tronModal: {
    flex: 1, backgroundColor: 'black', paddingTop: 40, paddingHorizontal: 25,
  },
  tronModal1: {
    flex: 1, justifyContent: 'center',
  },
  tronViewStyle: {
    backgroundColor: Colors.white,
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderRadius: 20,
    paddingVertical: 100
  }
  ,labelTextStyle:{
    color:Colors.white,
  },
  inputstyle:{
    borderColor:Colors.fadeDot,
    borderWidth:1
  }
});
