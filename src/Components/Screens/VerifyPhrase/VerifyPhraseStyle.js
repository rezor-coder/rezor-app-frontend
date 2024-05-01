import {StyleSheet} from 'react-native';
import {Colors} from '../../../theme';
import {windowWidth} from '../../../Constant';
import fonts from '../../../theme/Fonts';
import {ThemeManager} from '../../../../ThemeManager';
import {areaDimen, heightDimen, widthDimen} from '../../../Utils/themeUtils';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  headerWrapStyle: {
    position: 'absolute',
    top: '5%',
    left: '5%',
  },
  backIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  descriptionWrapStyle: {
    alignItems: 'flex-start',
    marginHorizontal: widthDimen(22),
    marginTop: heightDimen(6),
  },

  styleLabelHeader: {
    fontSize: areaDimen(30),
    fontFamily: fonts.semibold,
    textAlign: 'left',
    color: ThemeManager.colors.textColor,
    marginTop: heightDimen(30),
    marginHorizontal: widthDimen(22),
  },

  descriptionTextStyle: {
    fontFamily: fonts.regular,
    fontSize: areaDimen(14),
    textAlign: 'left',
    // opacity: 0.8,
    lineHeight: heightDimen(21),
  },
  organizedMnemonicsWrap: {
    // flex: 0.25,
    width: '80%',
    height: '34%',
    // marginTop: '8%',
    backgroundColor: Colors.lightBg,
    padding: 8,
    flexDirection: 'row',
    borderRadius: 5,
    flexWrap: 'wrap',
  },
  organizedMnemonicStyle: {
    backgroundColor: Colors.black,
    // height: 25,
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    marginVertical: 3,
    borderRadius: 3,
  },
  organizedMnemonicText: {
    padding: 3,
    // height:22,
    color: Colors.fadetext,
    fontSize: 13,
    fontFamily: fonts.regular,
  },
  unorganizedMnemonicsWrap: {
    //  flex: 0.25,
    width: '80%',
    height: '22%',
    marginTop: '8%',
    backgroundColor: Colors.black,
    padding: 5,
    flexDirection: 'row',
    borderRadius: 5,
    flexWrap: 'wrap',
  },
  unorganizedMnemonicStyle: {
    backgroundColor: Colors.lightBg,
    // height: 25,
    padding: 5,
    marginHorizontal: 5,
    marginVertical: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
  },
  unorganizedMnemonicText: {
    color: Colors.fadewhite,
    fontSize: 13,
    fontFamily: fonts.regular,
  },
  backBtn: {
    borderWidth: 1,
    // borderColor: Colors.white,
    color: ThemeManager.colors.textColor,
    borderRadius: 3,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginTop: '7%',
    width: 70,

    marginLeft: 'auto',
    marginRight: 'auto',
  },
  backBtnTextStyle: {
    // color: Colors.white,
    color: ThemeManager.colors.textColor,
    textAlign: 'center',
    fontFamily: fonts.regular,
  },
  btnStyle: {
    width: windowWidth * 0.9,
    height: heightDimen(60),
    marginTop: heightDimen(40),
    marginBottom: heightDimen(20),
  },

  customGrad: {
    borderRadius: heightDimen(30),
    // marginBottom: 100,
  },

  contentContainer: {
    //  alignSelf: 'center', marginTop: 5
  },

  listView: {
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: widthDimen(6),
    width: '50%',
  },
  listContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.borderColorLang,
    borderRadius: 12,
    margin: 7,
    height: 40,
    minWidth: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listText: {color: Colors.textColor, fontFamily: fonts.semibold, fontSize: 13},
  alignCenter: {alignSelf: 'center'},
  listContainerStyle: {
    borderWidth: 1,
    borderRadius: heightDimen(25),
    marginVertical: heightDimen(6),
    height: heightDimen(50),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  mnemonicNameText: {
    fontFamily: fonts.semibold,
    fontSize: areaDimen(15),
  },
  selectedListView: {
    flexDirection: 'row',
    marginHorizontal: widthDimen(3),
  },
  selectedListContainerStyle: {
    borderRadius: heightDimen(25),
    marginVertical: heightDimen(4),
    height: heightDimen(34),
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedArrMainViewStyle: {
    marginTop: heightDimen(16),
    marginHorizontal: widthDimen(16),
    height: heightDimen(170),
    flexDirection: 'column',
    flexWrap: 'wrap',
    paddingHorizontal: widthDimen(16),
    paddingVertical: widthDimen(12),
    borderWidth: 1,
    borderRadius: heightDimen(6),
  },
  mnemonicSelectedNameText: {
    fontFamily: fonts.semibold,
    fontSize: areaDimen(11),
    paddingHorizontal: 10,
  },
  viewMnemonicsSelection: {
    flexWrap: 'wrap',
    flex: 1,
    flexDirection: 'row',
    width: '100%',
  },
  viewClearAll: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  clearAllBtnStyle:{
    justifyContent:'flex-end',
    alignContent:'flex-end',
    alignItems:'flex-end',
    alignSelf:'baseline',
    paddingHorizontal: widthDimen(15),
    paddingVertical: heightDimen(4),
  },
  clearAllTextStyle:{
    fontSize: areaDimen(14),
    fontFamily: fonts.semibold,
    color: ThemeManager.colors.textColor,
  }
});
