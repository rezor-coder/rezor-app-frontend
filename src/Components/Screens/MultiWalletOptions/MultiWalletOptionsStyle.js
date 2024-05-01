import {StyleSheet} from 'react-native';
import {ThemeManager} from '../../../../ThemeManager';
import {Colors, Fonts} from '../../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: Colors.white,
    color: ThemeManager.colors.textColor,
  },
  innerContainer: {
    flex: 1,
    backgroundColor: Colors.black,
    borderTopEndRadius: 30,
    width: '100%',
    height: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceInput: {
    color: 'white',
    fontSize: 30,
    fontFamily: Fonts.normal,
  },
  numOfCoins: {
    fontSize: 20,
    fontFamily: Fonts.normal,
    color: Colors.darkGrey,
  },
  btnStyle: {
    width: '70%',
    height: 70,
    marginTop: '10%',
  },

  label: {
    alignSelf: 'flex-start',
    marginLeft: 4,
    marginVertical: 5,
    fontSize: 16,
    fontFamily: Fonts.normal,
    // color: Colors.white,
    color: ThemeManager.colors.textColor,
  },
  label1: {
    textAlign: 'center',
    alignSelf: 'center',
    marginLeft: 4,
    marginVertical: 5,
    fontSize: 16,
    fontFamily: Fonts.normal,
    // color: Colors.white,
    color: ThemeManager.colors.textColor,
  },

  btnStylen: {
    fontFamily: Fonts.regular,
    justifyContent: 'flex-end',
    backgroundColor: '#232531',
    borderWidth: 0,
    alignSelf: 'stretch',
    width: '100%',
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  btnTextStyle: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    // color: Colors.White,
    color: ThemeManager.colors.textColor,
    textAlign: 'left',
  },
  dropDownStyle: {
    backgroundColor: '#232531',
    borderRadius: 10,
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rowStyle: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
    paddingLeft: 20,
  },
  rowTextStyle: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    // color: Colors.White,
    color: ThemeManager.colors.textColor,
    textAlign: 'left',
  },
});
