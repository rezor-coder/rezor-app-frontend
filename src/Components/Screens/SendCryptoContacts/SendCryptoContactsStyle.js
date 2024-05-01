import { StyleSheet } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Images, Colors, Fonts } from '../../../theme';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';

export const styles = StyleSheet.create({
  HeaderMainView: {
    flexDirection: 'row',
    paddingHorizontal: 17,
    paddingVertical: 15,
  },
  backiconstyle: {
    height: 25,
    width: 25,
    tintColor: '#C738B1',
    resizeMode: 'center',
    alignSelf: 'center',
  },
  headingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingtxt: {
    color: '#CACACA',
    fontSize: 16,
    fontFamily: 'bold',
  },
  hamburgericon: {
    height: 20,
    width: 20,
    resizeMode: 'center',
    alignSelf: 'center',
  },
  roundView: {
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    flex: 1,
    // backgroundColor: 'black',
  },
  btnStyle: {
    // height: heightDimen(60),
    marginVertical: heightDimen(10),
    width: "100%",
    alignSelf: 'center',
  },
  recipientView: {
    // backgroundColor: '#202020',
    // borderRadius: 15,
    paddingVertical: 10,
    marginHorizontal: 15,
  },
  recipienttxtView: {
    width: 220,
    alignSelf: 'center',
  },
  recipienttxt: {
    color: '#666666',
    textAlign: 'center',
    marginTop: 20,
  },
  horizontallistView: {
    marginHorizontal: widthDimen(22),
    flex: 1,
  },
  contactsTextStyle: {
    fontSize: areaDimen(16),
    fontFamily: Fonts.semibold,
  },
  flatlistViewHorizontal: {
    // backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    paddingTop: heightDimen(20),
   
  },
  namewrap: {
    backgroundColor: '#C738B1',
    width: widthDimen(44),
    height: widthDimen(44),
    borderRadius: widthDimen(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameContactswrap: {
    backgroundColor: '#C738B1',
    width: widthDimen(38),
    height: widthDimen(38),
    borderRadius: widthDimen(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBack: {
    alignItems: 'flex-end',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'flex-end',
    marginBottom: heightDimen(10),
    marginHorizontal:widthDimen(5)
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnRight: {
    // backgroundColor: 'red',
    right: 0,
  },
  trashBox: {
    height: 100,
    width: 100,
    resizeMode: 'contain',
    backgroundColor: '#03011580',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trash: {
    height: 35,
    width: 35,
    resizeMode: 'contain',
  },
  backTextWhite: {
    color: '#FFF',
  },
  customGrad: {
    // borderRadius: heightDimen(25),
  },
});
