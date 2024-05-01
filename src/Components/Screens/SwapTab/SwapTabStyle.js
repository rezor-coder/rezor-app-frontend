import {StyleSheet} from 'react-native';
import {Images, Colors, Fonts} from '../../../theme';

export const styles = StyleSheet.create({
  roundView: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    backgroundColor: 'black',
  },
  tabMainView: {
    flexDirection: 'row',
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 350,
    // backgroundColor:'red',
    alignSelf: 'center',
  },
  defineView: {
    // paddingHorizontal: 9,
    // paddingVertical: 7,
    // marginHorizontal: 2,
    // backgroundColor:'pink',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  tabsView: {
    paddingHorizontal: 6,
    paddingVertical: 7,
    marginHorizontal: 1,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerRoundView: {
    backgroundColor: '#202020',
    flex: 1,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    // marginBottom:20
  },
  swapView: {
    backgroundColor: '#000000',
    paddingVertical: 15,
    borderRadius: 4,
    marginTop: 10,
  },
  swapinnerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  righttext: {
    color: '#CACACA',
    textAlign: 'right',
  },
  imgStyle: {
    height: 30,
    width: 30,
    alignSelf: 'center',
    marginLeft: 5,
  },
  sliderView: {
    alignItems: 'center',
    marginTop: 10,
  },
  receiveView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  receivetxt: {
    color: '#4D4D4D',
    fontSize: 10,
    flex: 1,
  },
  swapIcon: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
  receiverighttext: {
    color: '#C73E26',
    flex: 1,
    textAlign: 'right',
  },
  btnStyle: {
    height: 50,
    marginVertical: 20,
  },
  viewStyle: {
    borderBottomWidth: 1,
    borderColor: Colors.White,
    marginHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  textstyle: {
    fontFamily: Fonts.regular,
    color: Colors.white,
    fontSize: 14,
    alignSelf: 'center',
    marginBottom: 10,
  },
});
