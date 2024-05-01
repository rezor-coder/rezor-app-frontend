import { StyleSheet } from 'react-native';
import { Images, Colors, Fonts } from '../../../theme';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';

export default StyleSheet.create({
  wrap: {
    color: Colors.white,
    fontFamily: Fonts.medium,
    fontSize: areaDimen(14),
    // marginVertical: heightDimen(10),
    // backgroundColor: 'red'
    // borderBottomWidth: 0.5,
    // borderColor: Colors.headerBg
  },
  formwrap: {
    flex: 1,
    // paddingTop: 25,
    // backgroundColor: Colors.black,
    paddingHorizontal: widthDimen(22),
  },
  Securitytext: {
    fontSize: 14,
    color: Colors.white,
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 25,
    fontFamily: Fonts.regular,
  },
  currencyStyle: {
    flexDirection: 'row',

    // height: 70,
    paddingVertical: heightDimen(15),
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: 'green'
    // marginBottom: 10
  },

  rightImgStyle: { tintColor: Colors.White },
});
