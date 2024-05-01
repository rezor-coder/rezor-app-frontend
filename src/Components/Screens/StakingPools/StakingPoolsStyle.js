import {StyleSheet} from 'react-native';
import {Images, Colors, Fonts} from '../../../theme';
export const styles = StyleSheet.create({
  roundView: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal: 16,
  },
  textStyle: {fontSize: 12, fontFamily: Fonts.normal},
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  img1: {height: 12, width: 17},
  img2: {height: 12, width: 12},
  toogleView: {
    height: 12,
    width: 22,
    backgroundColor: '#fff',
    transform: [{rotate: '180deg'}],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  livetext: {
    backgroundColor: Colors.pink,
    padding: 4,
    borderRadius: 20,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropDownView: {
    height: 15,
    width: 80,
    backgroundColor: Colors.fadewhite,
    borderRadius: 20,
  },
  Row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 7,
    marginTop: 1.5,
  },
  listView: {marginTop: 20, marginHorizontal: 10},
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 0.3,
    borderBottomWidth: 0.3,
    borderColor: Colors.darkFade,
    padding: 10,
  },
  downImg: {
    height: 10,
    width: 10,
    tintColor: '#fff',
    resizeMode: 'contain',
  },
});
