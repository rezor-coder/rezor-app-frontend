import {StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  innerContainer: {
    flex: 1,
    // backgroundColor: Colors.black,
    borderTopEndRadius: 30,
    width: '100%',
    height: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceInput: {
    color: Colors.lightGrey,
    fontSize: 50,
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
});
