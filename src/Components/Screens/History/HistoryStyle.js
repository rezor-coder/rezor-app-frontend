import { StyleSheet } from 'react-native';
import { Images, Colors, Fonts } from '../../../theme';
import fonts from '../../../theme/Fonts';
import { widthDimen } from '../../../Utils/themeUtils';

export const styles = StyleSheet.create({
  roundView: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    backgroundColor: 'black',
    paddingVertical: 30,
  },
  btnStyle: {
    height: 23,
    width: 100,
    marginLeft: 40,
  },
  addWalletView: {
    backgroundColor: Colors.inputDarkbg,
    marginTop: 25,
    borderRadius: 4,
  },
  addressView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  pastetxt: {
    color: Colors.fadeDot,
    textAlign: 'center',
  },
  scanView: {
    marginLeft: 10,
    marginRight: 20,
    alignSelf: 'center',
  },
  iconstyle: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    tintColor: Colors.fadeDot,
  },
  line: {
    backgroundColor: '#000000',
    height: 2,
    alignSelf: 'center',
    marginHorizontal: 15,
    width: 300,
  },
  networkView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  nettxt: {
    paddingLeft: 20,
    color: Colors.fadeDot,
    fontSize: 16,
    fontFamily: fonts.normal,
  },
  downiconview: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  downiconstyle: {
    height: 12,
    width: 12,
    resizeMode: 'contain',
  },
  savebtn: {
    height: 50,
    width: '99%',
    alignSelf: 'center',
  },
  tokenItem: {
    // borderWidth: 1,
    // borderColor: Colors.lossText,
    // paddingVertical: 10,
    // paddingHorizontal: 10,
    borderRadius: 10,
    // marginVertical: 5,
    // marginHorizontal: 15,
    // alignItems: 'stretch',
    // elevation: 5
  },
  viewStyle: {
    // marginHorizontal: widthDimen(22),
    flexDirection: 'row',
    // flex: 1,
    alignItems: 'center',//vertical
    justifyContent: 'space-between'
  },
  textTransaction: {
    fontFamily: Fonts.semibold,
    fontSize: 15,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
});
