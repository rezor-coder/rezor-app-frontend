import { StyleSheet, Dimensions } from 'react-native';
import { Images, Colors, Fonts } from '../../../theme';


export default StyleSheet.create({
  ContainerView: {},

  container: {
    flex: 1,
    alignItems: 'center', // horizontal center
    flexDirection: 'column',
    
    alignItems: 'center',
    marginTop: 0,
  },

  TopContainerView: {
    flex: 0.2,
    flexDirection: 'column',
    width: '100%',
  },
  mainViewStyle: {
    width: '100%', 
    flex: 1, 
    alignItems: 'center',  
  },
  EnterYourStyle: {
    color: Colors.textDark,
    fontSize: 25,
    marginTop: 100,
    marginLeft: 20,
    marginRight: 20,
    fontFamily: Fonts.regular,
  },
  EnterYourPhoneStyle: {
    color: Colors.White,
    fontSize: 25,
    marginTop: 0,
    marginLeft: 20,
    marginRight: 20,
    fontFamily: Fonts.regular,
  },
  EnterPhoneTextStyle: {
    left: 15,
    right: 15,
    top: Dimensions.get('window').height / 2 - 25,
    height: 50,
    borderRadius: 5,
     
    position: 'absolute',
  },
  EnterPhonetextFStyle: {
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  ContinueButtonStyle: {
    left: 15,
    right: 15,
    top: Dimensions.get('window').height / 2 + 50,
    height: 50,
    borderRadius: 5, 
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ContinueTextStyle: {
    color: Colors.textDark,
    fontFamily: Fonts.regular
  },

  FlatlistStyle: {
    width: Dimensions.get('window').width,
    marginTop: 10

  },
  SearchViewStyle: {
    paddingLeft: 16,
    paddingRight: 16,
    marginTop:-20,
    
    justifyContent:'center',
    // backgroundColor: '#fff',
    width: Dimensions.get('window').width,
  },
  SearchTextF: {
    marginLeft: 10,
    marginRight: 10,
    paddingHorizontal: 10,
    height: '80%',
    borderRadius: 10,
    fontFamily: Fonts.regular, 
  },

  InnerKeyboard: {
    flex: 1,
    width: Dimensions.get('window').width,
    marginTop: 0,
    alignContent: 'center',
    justifyContent: 'center', 
  },

  FlatlistCell: {
    flexDirection: 'row',
    borderBottomWidth: 0.6,
    borderBottomColor: Colors.Grey,
    paddingHorizontal: 16, paddingVertical:10
  },
  FlatListCellSubView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 10,
    flex: 1,

  },
  FlatlistCellLeftView: {
    height: '100%',
    marginLeft: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currencyImage: {
    marginLeft: 15,
    height: 30,
    width: 30,
    backgroundColor: '#000',
    borderRadius: 15,
  },
  coinNameText: {
    color: Colors.textDark,
    fontFamily: Fonts.regular,
    fontSize: 16,
  },
  countryCodeStyle: {
    fontFamily: Fonts.regular,
    fontSize: 15
  },

  imgstyle: {
    position: 'absolute',
    width: 30,
    height: 30,
    resizeMode: 'contain',
    top: 7,
    justifyContent: 'center',
    right: 10,
    zIndex: 2
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
  searchIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    // top: 13,
    // left: '90%',
    alignSelf: 'center',
  },
});
