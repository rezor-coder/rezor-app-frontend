import {StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../../theme';

export default StyleSheet.create({
  wrap: {marginHorizontal: 26, marginTop: 15, flex: 1},
  continueBox: {width: '99%', position: 'absolute', bottom: 15},
  continueBtn: {height: 50, width: '99%', position: 'absolute', bottom: 15},
  continueBtn1: {height: 50, width: '99%', marginTop: 10, marginBottom: 10},
  percentBtn: {width: '22%', marginTop: 15},
  addBtn: {
    alignSelf: 'center',
    marginTop: 15,
  },
  liquidityTxt: {
    color: Colors.lightGrey3,
    fontFamily: Fonts.regular,
    fontSize: 13,
    marginTop: 15,
  },
  liquidityTxt1: {
    color: Colors.lightGrey3,
    fontFamily: Fonts.regular,
    fontSize: 13,
    marginTop: 3,
  },
  textReg14: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    textTransform: 'uppercase',
  },
  textSm14: {
    fontFamily: Fonts.semibold,
    fontSize: 14,
  },
  textReg12: {
    fontFamily: Fonts.regular,
    fontSize: 12,
  },
  pinkRoundBox: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 12,
    borderColor: Colors.pink,
    borderWidth: 1,
    marginTop: 15,
  },
  toImage: {
    height: 22,
    width: 22,
    borderRadius: 18,
  },
  fromImageView: {
    height: 30,
    width: 30,
    position: 'absolute',
    left: 18,
    borderRadius: 18,
    borderWidth: 4,
    borderColor: 'rgba(155,155,255,0.2)',
  },
  toImageView: {
    height: 30,
    width: 30,
    borderRadius: 18,
    borderWidth: 4,
    borderColor: 'rgba(155,155,255,0.1)',
    alignContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  inputTxt: {
    height: 45,
    borderRadius: 14,
    borderWidth: 1,
    // borderColor: Colors.fadetext,
    borderColor: '#272C39',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  buttons: {
    selected: {},
    unSelected: {},
  },
  closeBtn: {
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#8F939E',
    width: 20,
    height: 20,
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: '#1D212B',
    marginTop: 10,
  },
  blurBg: {
    flex: 1,
    backgroundColor: 'rgba(29, 30, 38, 0.8)',
    justifyContent: 'center',
  },
});
