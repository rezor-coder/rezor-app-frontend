import {StyleSheet} from 'react-native';
import {Images, Colors, Fonts} from '../../../theme';

export default StyleSheet.create({
  searchBarStyle: {
    backgroundColor: Colors.headerBg,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    paddingTop: 25,
  },
  inputStyle: {
    paddingLeft: 55,
    backgroundColor: Colors.searchBoxbg,
  },
  addWallet__style: {
    position: 'absolute',
    right: 30,
    bottom: 25,
  },
  balanceView: {width: 100, marginRight: 3},
  card: {
    backgroundColor: Colors.inputDarkbg,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  img: {width: 20, height: 20, resizeMode: 'contain'},
  btnStyle: {
    height: 50,
    width: '100%',
    alignSelf: 'center',
  },
  securityView: {
    backgroundColor: 'lightgrey',
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 20,
  },
});
