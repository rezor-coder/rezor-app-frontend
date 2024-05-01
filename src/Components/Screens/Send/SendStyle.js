import { StyleSheet } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Colors, Fonts } from '../../../theme';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';

export default StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // backgroundColor: Colors.black,
    padding: 20,
  },
  listView: {
    flex: 1,
    // paddingTop: 25,
    // backgroundColor: Colors.screenBg,
    paddingHorizontal: widthDimen(22),
  },
  balanceBoxStyle: {
    width: '100%',
    paddingHorizontal: 30,
    paddingVertical: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  charAtimg: {
    height: widthDimen(30),
    width: widthDimen(30),
    borderRadius: widthDimen(15),
    backgroundColor: '#212121',
    alignItems: 'center',
    justifyContent: 'center',
  },
  charIconTextStyle: {
    color: 'white',
    fontFamily: Fonts.semibold,
    fontSize: areaDimen(16),
  },
  nameTextStyle: {
    fontFamily: Fonts.medium,
    fontSize: areaDimen(16),
  },
  fiatValueTextStyle: {
    fontFamily: Fonts.medium,
    fontSize: areaDimen(14),
    marginTop: heightDimen(4)
  },
  titleTextStyle: {
    // color: Colors.white
    color: ThemeManager.colors.textColor,
  },
  balanceTextStyle: {
    // color: Colors.white,
    color: ThemeManager.colors.textColor,
    fontSize: 45,
    fontWeight: 'bold',
  },
  editIconStyle: {
    position: 'absolute',
    width: 20,
    height: 20,
    bottom: 12,
    right: 12,
    resizeMode: 'contain',
  },
  menuItemStyle: {
    width: '23%',
    height: 90,
    backgroundColor: Colors.lightBg,
    borderRadius: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: '1%',
  },
  coinsListStyle: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingVertical: 14,
    alignItems: 'center',
    marginVertical: heightDimen(7),
    paddingHorizontal: widthDimen(20),
    paddingVertical: heightDimen(14),
    borderRadius: heightDimen(14)
  },
  balanceViewStyle: {
    alignSelf: 'flex-end',
    width: '50%',
  },
  balanceText: {
    // color: Colors.fadetext,
    alignSelf: 'flex-end',
    fontFamily: Fonts.medium,
    fontSize: areaDimen(14),
    textAlign: 'right',
  },
  coinStyle: {
    height: widthDimen(30),
    width: widthDimen(30),
    borderRadius: widthDimen(15),
  },
  coinGrowthStyle: {
    alignSelf: 'flex-end',
    color: Colors.lightGrey2,
    fontFamily: Fonts.medium,
    fontSize: areaDimen(14),
    marginTop: heightDimen(4)
  },
  graphImage: {
    height: 40,
    width: 150,
    resizeMode: 'contain',
  },
  searchIcon: {
    position: 'absolute',
    width: 22,
    height: 22,
    resizeMode: 'contain',
    top: 13,
    //  ri: '90%',
    left: 30,
    backgroundColor: 'green',
  },
  imgstyle: {
    position: 'absolute',
    width: widthDimen(30),
    height: heightDimen(44),
    resizeMode: 'contain',
    justifyContent: 'center',
    right: widthDimen(10),
    zIndex: 2
  },
});
