import { StyleSheet } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Images, Colors, Fonts } from '../../../theme';
import fonts from '../../../theme/Fonts';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';
export const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  // textView: {alignItems: 'center', justifyContent: 'center', marginTop: 50},

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontFamily: fonts.regular,
    fontSize: areaDimen(14),
    textAlign: 'left',
    // opacity: 0.8,
    lineHeight: heightDimen(22),
  },
  textView: {
    alignItems: 'flex-start',
    marginHorizontal: widthDimen(22),
    marginTop: heightDimen(6),
  },
  textViewnew: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    alignSelf: 'center',
    paddingTop: 8,
    marginTop: 2,
  },
  contentContainer: {
    // alignSelf: 'center', marginTop: 10 
  },
  listView: {
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: widthDimen(6),
    width: '50%'
  },
  listContainer: {
    borderWidth: 1,
    borderRadius: heightDimen(25),
    marginVertical: heightDimen(6),
    height: heightDimen(50),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  listText: { fontFamily: fonts.semibold, fontSize: areaDimen(15) },
  numberText: {
    color: Colors.white,
    fontFamily: fonts.semibold,
    fontSize: areaDimen(15),
  },

  copyBtn: {
    // borderColor: Colors.buttonColor5,
    alignSelf: 'center',
    height: heightDimen(36),
    minWidth: widthDimen(104),
    borderRadius: heightDimen(18),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: heightDimen(32),
    // marginBottom: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  imgCopyInside: {
    height: widthDimen(14),
    width: widthDimen(14),
  },
  copyText: {
    fontFamily: Fonts.semibold,
    marginStart: 6,
    fontSize: areaDimen(14),

  },
  btnStyle: {
    width: '100%',
    // height: heightDimen(60),
    // marginTop: 20,
    paddingHorizontal: widthDimen(22),
    marginTop: heightDimen(112),
    marginBottom: heightDimen(20),
  },

  customGrad: {
    // borderRadius: heightDimen(30),
  },

  backBtn: {
    marginTop: '5%',
    alignSelf: 'center',
    height: 35,
    width: 50,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.fadetext,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 7,
  },

  backTouchable: { marginTop: 44, marginStart: 12, padding: 5 },

  imgBackStyle: { width: 26, height: 26, tintColor: Colors.white },

  txtHeading: {
    color: Colors.white,
    fontSize: areaDimen(30),
    fontFamily: Fonts.semibold,
    // alignSelf: 'flex-start',
    textAlign: 'left',
    marginTop: heightDimen(30),
    // backgroundColor: 'red',
    marginHorizontal: widthDimen(22)
  },
});
