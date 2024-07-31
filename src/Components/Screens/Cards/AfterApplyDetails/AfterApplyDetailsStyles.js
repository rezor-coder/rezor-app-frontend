import {StyleSheet} from 'react-native';
import {areaDimen, heightDimen, width, widthDimen} from '../../../../Utils/themeUtils';
import {Colors, Fonts} from '../../../../theme';

export default StyleSheet.create({
  mainView: {flex: 1},
  mainContainer: {
    flex: 1,
    paddingVertical: areaDimen(30),
    paddingHorizontal: areaDimen(22),
  },
  checkTouchStyle: {
    flexDirection: 'row',
    width: '100%',
    marginTop: areaDimen(20),
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  imgView: {
    resizeMode: 'contain',
    height: heightDimen(18),
    width: widthDimen(20),
    borderRadius: areaDimen(20),
  },
  readAndAccept: {
    color: Colors.black,
    fontSize: areaDimen(16),
    fontFamily: Fonts.regular,
    paddingLeft: widthDimen(10),
  },
  formView: {
    paddingHorizontal: widthDimen(20),
    marginTop: heightDimen(10),
    paddingBottom:heightDimen(20)
  },
  buttonView: {
    width: width - 44,
    height: heightDimen(60),
    borderRadius: areaDimen(30),
    alignSelf: 'center',
    marginBottom: areaDimen(32),
  },
});
