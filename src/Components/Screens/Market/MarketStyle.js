import { StyleSheet, Dimensions } from 'react-native';
import { Colors, Fonts } from '../../../theme';
import { widthDimen } from '../../../Utils/themeUtils';

export default StyleSheet.create({
  rowList: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  listView: {
    borderTopWidth: 1,
    borderBottomWidth: 0.4,
    borderColor: '#1D1D1B',
    marginHorizontal: 10,
  },
  searchIcon: {
    // position: 'absolute',
    width: 20,
    height: 20,
    resizeMode: 'contain',
    // top: 13,
    // left: '90%',
    alignSelf: 'center',
  },
  searchIcon1: {
    tintColor: Colors.fadeDot,
    // position: 'absolute',
    width: 18,
    height: 18,
    resizeMode: 'contain',
    // top: 13,
    // left: '90%',
    alignSelf: 'center',
  },
  imgstyle: {
    position: 'absolute',
    width: 30,
    height: 30,
    resizeMode: 'contain',
    top: 13,
    justifyContent: 'center',
    left: '90%',
  },

  searchImg: { height: 13.5, width: 13.5, marginLeft: 4 },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchView: {
    height: 35,
    width: 100,
    borderRadius: 5,
    backgroundColor: '#333333',
    alignSelf: 'flex-end',
    marginRight: 21,
    marginTop: 25,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    alignSelf: 'center',
    color: Colors.fadetext,
  },
  textView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    alignSelf: 'center',
    paddingTop: 25,
  },
  roundView: {
    flex: 1,
    marginHorizontal: widthDimen(22),
    //  backgroundColor: 'White',
  },
  coinStyle: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  coinPriceStyle: {
    alignSelf: 'flex-end',
    color: Colors.darkGrey,
    fontSize: 12,
    fontFamily: Fonts.regular,
  },
  graphImage: {
    height: 40,
    width: 150,
    resizeMode: 'contain',
  },
  coinListWrapStyle: {
    marginTop: 15,
    paddingBottom: 70,
    flexGrow: 1,
  },
  balanceViewStyle: {
    alignSelf: 'flex-end',
    width: '28%',
  },
  balanceText: {
    color: Colors.fadetext,
    alignSelf: 'flex-end',
    fontFamily: Fonts.regular,
    textAlign: 'right',
  },
  coinsListStyle: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: '#1D1D1B',
    flexDirection: 'row',
    paddingVertical: 14,
    alignItems: 'center',
  },
  nameImage_style: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.buttonColor1,
  },
  tokenImageText_style: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.white,
  },
  NoDataStyle: {
    height: Dimensions.get('screen').height / 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  NoDataStyle1: {
    // justifyContent: 'center',
    // alignItems: 'center',
    position: 'absolute',
    bottom: 55,
    backgroundColor: 'pink',
    flex: 2,
  },
  NoDataTextStyle: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.fadetext,
    textAlign: 'center',
  },



  textStyle: {
    color: Colors.lightGrey3,
    opacity: 0.8,
    fontFamily: Fonts.medium,
    fontSize: 10,
  },
  // coinStyle1: {
  //   // letterSpacing: -1.52,
  //   fontFamily: Fonts.regular,
  //   fontSize: 13,
  //   textTransform: 'uppercase',
  // },
  lastStyle: {
    color: Colors.activeText,
    letterSpacing: -1.52,
    fontFamily: Fonts.regular,
    fontSize: 15,
    textAlign: 'left',
    textTransform: 'uppercase',
  },

  sliderImgStyle: { height: '100%' },

});
