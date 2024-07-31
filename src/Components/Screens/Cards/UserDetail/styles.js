import {StyleSheet} from 'react-native';
import {areaDimen, heightDimen, width,widthDimen} from '../../../../Utils/themeUtils';


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingVertical: areaDimen(30),
    paddingHorizontal: areaDimen(22),
  },
  buttonView: {
    width: width - 44,
    height: heightDimen(60),
    borderRadius: areaDimen(30),
    alignSelf: 'center',
    marginBottom: areaDimen(32),
  },
  iconStyle: {
    height: heightDimen(11),
    width: widthDimen(11),
  },
});
export default styles;
