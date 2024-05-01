import {StyleSheet} from 'react-native';
import {ThemeManager} from '../../../../ThemeManager';
import {Colors, Fonts} from '../../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    backgroundColor: Colors.black,
    padding: 20,
  },
  balanceBoxStyle: {
    width: '100%',
    paddingHorizontal: 30,
    paddingVertical: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
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
    borderTopWidth: 1,
    borderColor: '#1D1D1B',
    flexDirection: 'row',
    paddingVertical: 14,
    alignItems: 'center',
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
  coinStyle: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  coinPriceStyle: {
    alignSelf: 'flex-end',
    color: Colors.darkGrey,
    fontSize: 12,
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
    right: 20,
    // left: '90%'
  },
});
