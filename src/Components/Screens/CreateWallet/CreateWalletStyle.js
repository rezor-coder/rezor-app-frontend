import {StyleSheet} from 'react-native';
import {Images, Colors, Fonts} from '../../../theme';
export const styles = StyleSheet.create({
  mainView: {flex: 1},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#fff',
  },
  heading: {
    color: Colors.languageHeader,
    fontSize: 13,
  },
  back: {
    height: 40,
    width: 50,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 15,
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
    width: 350,
    alignSelf: 'center',
    paddingTop: 25,
  },
  imgView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 85,
    paddingHorizontal: 20,
  },
  Img: {
    height: 100,
    width: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  imgText: {
    color: Colors.fadewhite,
    fontFamily: Fonts.bold,
    // letterSpacing: -1.61,
    alignSelf: 'center',
    marginTop: 15,
  },
  text: {
    fontSize: 15,
    alignSelf: 'center',
    color: Colors.fadetext,
    fontFamily: Fonts.regular,
    textAlign: 'center',
  },
});
