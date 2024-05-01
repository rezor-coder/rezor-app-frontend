import {StyleSheet} from 'react-native';
import {Colors} from '../../../theme';
import fonts from '../../../theme/Fonts';

export default StyleSheet.create({
  roundView: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    // backgroundColor: 'black',
  },
  textStyle: {
    color: Colors.darkFade,
    marginVertical: 15,
    marginHorizontal: 10,
    fontFamily: fonts.normal,
  },
  roundImg: {
    height: 30,
    width: 30,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: -10,
  },
  advncOptionView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 70,
  },
  btnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  btnSlow: {borderTopLeftRadius: 5, borderBottomLeftRadius: 5},
  btnAvrage: {backgroundColor: Colors.inputDarkbg},
  fastBtn: {
    borderTopRightRadius: 5,
    backgroundColor: Colors.inputDarkbg,
    borderRightWidth: 0,
    borderBottomRightRadius: 5,
  },
  amountView: {alignSelf: 'flex-end', paddingHorizontal: 15},
  amount: {
    color: Colors.white,
    alignSelf: 'flex-end',
    marginRight: 10,
  },
});
