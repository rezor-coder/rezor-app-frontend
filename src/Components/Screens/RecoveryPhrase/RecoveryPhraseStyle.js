import { StyleSheet } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Images, Colors, Fonts } from '../../../theme';
import fonts from '../../../theme/Fonts';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';
export const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    // backgroundColor: Colors.Darkbg,
    marginRight: 10,
    // marginLeft: 10,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  // text: {
  //   letterSpacing: -0.61,
  //   width: 270,
  //   alignSelf: 'center',
  //   color: Colors.fadetext,
  //   textAlign: 'center',
  // },
  // textView: {
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   width: 300,
  //   alignSelf: 'center',
  //   paddingTop: 25,
  // },
  text: {
    alignSelf: 'center',
    color: Colors.lightGrey3,
    fontSize: areaDimen(14),
    fontFamily: Fonts.regular,
    textAlign: 'center',
    // opacity: 0.8,
    lineHeight: heightDimen(25),
  },
  textView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: widthDimen(22),
    alignSelf: 'center',
    marginTop: heightDimen(25),
  },
  contentContainer: {
    alignSelf: 'center', marginTop: 5,
    // width: '100%',
    marginHorizontal: widthDimen(18)
  },
  // listView: { alignItems: 'center', justifyContent: 'center' },
  listView: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: widthDimen(6),
    width: '50%',
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
  listText: { fontFamily: fonts.semibold, fontSize: areaDimen(13) },
  numberText: {
    color: Colors.FakeJade,
    fontFamily: fonts.semibold,
    fontSize: areaDimen(13),
  },
  // copyBtn: {
  //   marginTop: 10,
  //   backgroundColor: Colors.fadewhite,
  //   alignSelf: 'flex-end',
  //   height: 38,
  //   width: 100,
  //   borderRadius: 4,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   // right: '10.5%',
  //   alignSelf:'center',
  //   marginTop:80
  // },
  copyBtn: {
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
  txtHeading: {
    // color: Colors.white,
    color: ThemeManager.colors.textColor,
    fontSize: 30,
    fontFamily: Fonts.bold,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 40,
  },
  btnStyle: {
    width: '100%',
    // height: 50,
    paddingHorizontal: widthDimen(22),
  },

  customGrad: {
    // borderRadius: 25,
  },

});
