import {StyleSheet} from 'react-native';
import {ThemeManager} from '../../../../../ThemeManager';
import {areaDimen, heightDimen, width, widthDimen} from '../../../../Utils/themeUtils';
import {Colors, Fonts} from '../../../../theme';

export const styles = StyleSheet.create({
  cardLockImageStyle: {
    height: areaDimen(75),
    width: areaDimen(75),
    alignSelf: 'center',
    marginBottom: areaDimen(16),
    borderRadius: areaDimen(75),
  },
  cardLockTitle: {
    textAlign: 'center',
    alignSelf: 'center',
    color: ThemeManager.colors.textColor,
    fontSize: areaDimen(18),
    fontFamily: Fonts.semibold,
    lineHeight: heightDimen(27),
    maxWidth: width / 1.2,
  },
  cardLockSubTitle: {
    textAlign: 'center',
    alignSelf: 'center',

    color: Colors.red,
    fontSize: areaDimen(14),
    lineHeight: heightDimen(18),
    marginTop: areaDimen(8),
    maxWidth: width / 1.2,
    fontFamily: Fonts.semibold,
  },
  goToRechargeButton: {
    width: width - 52,
    height: heightDimen(60),
    borderRadius: areaDimen(30),
    alignSelf: 'center',
    marginTop: areaDimen(24),
    marginBottom: areaDimen(24),
  },
  coinView: {
    borderRadius: widthDimen(20),
    width: widthDimen(30),
    height: widthDimen(30),
    backgroundColor: Colors.Black,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Platform.OS === 'ios' ? areaDimen(12) : areaDimen(6),
    // flex:0.16
  },
  coinText: {
    color: 'white',
    fontFamily: Fonts.semibold,
    fontSize: areaDimen(15),
    lineHeight: heightDimen(18),
  },
  feeTextShimmer: {
    width: widthDimen(200),
    alignSelf: 'center',
    height: heightDimen(25),
    borderRadius: areaDimen(3),
  },
  feeTextShimmer2: {
    width: widthDimen(266),
    alignSelf: 'center',
    height: heightDimen(40),
    borderRadius: areaDimen(3),
    marginTop: heightDimen(2),
  },
  availableBal: {
    textAlign: 'right',
    fontFamily: Fonts.semibold,
    fontSize: areaDimen(14),
    marginBottom: heightDimen(20),
  },
  welcomFirstView: {
    alignItems: 'center',
    paddingVertical: areaDimen(24),
    overflow: 'hidden',
    borderRadius: areaDimen(20),
    marginHorizontal: widthDimen(24),
    marginBottom: heightDimen(24),
  },
  welcomText: {
    fontSize: areaDimen(18),
    fontFamily: Fonts.semibold,
    lineHeight: heightDimen(36),
    maxWidth: width / 1.2,
    textAlign: 'center',
  },
  welcomSubTitle: {
    fontSize: areaDimen(15),
    fontFamily: Fonts.regular,
    lineHeight: heightDimen(24),
    maxWidth: width / 1.2,
    textAlign: 'center',
    marginTop: heightDimen(8),
  },
});
