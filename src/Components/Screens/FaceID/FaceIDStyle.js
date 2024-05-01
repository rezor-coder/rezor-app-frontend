import {StyleSheet} from 'react-native';
import {Images, Colors, Fonts} from '../../../theme';
import fonts from '../../../theme/Fonts';
export const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    alignItems: 'center',
    // backgroundColor: Colors.Darkbg,
  },
  btnView2: {
    marginTop: 20,
    alignSelf: 'center',
    height: 40,

    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 7,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splash_bg: {
    height: 700,
    width: '100%',
  },
  logo: {
    height: 260,
    width: 290,
    position: 'absolute',
    marginTop: 300,
    alignSelf: 'center',
  },
  splashdarkbg: {
    height: 300,
    width: '100%',
    position: 'relative',
    bottom: 190,
  },
  faceIdText: {
    color: Colors.lightWhite,
    fontSize: 30,
    marginTop: '30%',
    alignSelf: 'center',
    fontFamily: fonts.regular,
  },
  img: {height: 100, width: 100, marginTop: '35%', alignSelf: 'center'},
  textApprove: {
    color: Colors.lightWhite,
    fontSize: 30,
    marginTop: '35%',
    alignSelf: 'center',
    fontFamily: fonts.regular,
  },
});
