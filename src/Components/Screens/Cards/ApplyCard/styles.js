import {StyleSheet} from 'react-native';
import {areaDimen, heightDimen, width,widthDimen} from '../../../../Utils/themeUtils';
import { Colors, Fonts } from '../../../../theme';
import { ThemeManager } from '../../../../../ThemeManager';
export const styles = StyleSheet.create({
  mainContainerStyle: {
    flex: 1,
  },
  borderLineStyle: {
    height: heightDimen(1),
    backgroundColor: ThemeManager.colors.borderColor,
  },
  listMainStyle: {
    marginTop: areaDimen(16),
    // paddingHorizontal: areaDimen(22),
  },
  headerTextStyle: {
    fontFamily: Fonts.semibold,
    fontSize: areaDimen(16),
    maxWidth: width / 3,
    lineHeight: heightDimen(19),
    marginBottom: areaDimen(16),
  },
  gradientView: {
    position: 'absolute',
    bottom: 0,
    zIndex: 200,
    paddingHorizontal: areaDimen(22),
    paddingVertical: areaDimen(11),
    borderTopRightRadius: areaDimen(20),
    // borderWidth: 1,
    borderBottomLeftRadius: areaDimen(17),
    overflow: 'hidden',
  },
  cardName: {
    lineHeight: heightDimen(18),
    fontFamily: Fonts.regular,
    fontSize: areaDimen(14),
    color: Colors.White,
    paddingHorizontal: areaDimen(24),
    marginBottom: areaDimen(4),
    maxWidth: width / 1.6,
  },
  cardBrand: {
    lineHeight: heightDimen(19),
    fontFamily: Fonts.semibold,
    fontSize: areaDimen(16),
    color: Colors.White,
  },
  cardInnerView: {
    zIndex: 100,
    // top: areaDimen(61),
    paddingTop: areaDimen(61),
    height: '100%',
  },
  carSubtitle: {
    lineHeight: heightDimen(15),
    fontFamily: Fonts.regular,
    fontSize: areaDimen(12),
    color: Colors.White,
    opacity: 0.7,
    paddingHorizontal: areaDimen(24),
    maxWidth: width / 1.6,
    textTransform:'capitalize'
  },
  kycTitleStyle: {
    color: Colors.White,
    position: 'absolute',
    right: areaDimen(26),
    top: heightDimen(25),
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectedCardText: {
    lineHeight: heightDimen(19),
    fontFamily: Fonts.semibold,
    fontSize: areaDimen(14),
    maxWidth: width / 2,
    marginBottom: areaDimen(16),
    marginTop: areaDimen(24),
    color: Colors.buttonColor1,
  },

  buttonText: {
    textAlign: 'center',
    color: Colors.white,
    fontSize: areaDimen(16),
    fontFamily: Fonts.semibold,
  },
  cardInfoDetailView: {
    borderWidth: 1,
    borderColor: ThemeManager.colors.lightBlue,
    paddingVertical: areaDimen(12),
    borderRadius: areaDimen(12),
    marginTop: areaDimen(6),
    marginHorizontal: areaDimen(22),

  },
  cardInfoText: {
    lineHeight: heightDimen(19),
    fontFamily: Fonts.semibold,
    fontSize: areaDimen(16),

    marginHorizontal: areaDimen(12),
    marginBottom: areaDimen(16),
  },
  flexRowJustify: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: areaDimen(24),
  },
  cardInfoTitle: {
    lineHeight: heightDimen(15),
    fontFamily: Fonts.semibold,
    fontSize: areaDimen(12),
    color: ThemeManager.colors.inActiveColor,
    flex: 0.4,
    textTransform: 'capitalize',
  },
  cardInfoSubTitle: {
    lineHeight: heightDimen(15),
    fontFamily: Fonts.semibold,
    fontSize: areaDimen(12),
    color: ThemeManager.colors.textColor,
    flex: 0.6,
    textAlign: 'right',
  },
  borderLine: {
    borderBottomWidth: 1,
    borderColor: ThemeManager.colors.lightBlue,
    marginVertical: areaDimen(12),
  },
  restricedView: {
    marginRight: areaDimen(12),
    padding: areaDimen(10),
    marginTop: areaDimen(12),
    borderRadius: areaDimen(12),
  },
  restrictedCountriesTitle: {
    lineHeight: heightDimen(18),
    fontFamily: Fonts.semibold,
    fontSize: areaDimen(16),
    color: Colors.black,
  },
  restrictedCountriesText: {
    lineHeight: heightDimen(15),
    fontFamily: Fonts.semibold,
    fontSize: areaDimen(12),
    color: Colors.black,
  },
  flexRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  restrictedCountriesMainView: {
    backgroundColor: Colors.lightRedColor,
    padding: areaDimen(10),
    borderRadius: areaDimen(12),
    marginVertical: areaDimen(16),
    marginHorizontal: areaDimen(22),

  },
  dotStyle: {
    height: areaDimen(4),
    width: areaDimen(4),
    backgroundColor: Colors.buttonColor1,
    borderRadius: areaDimen(10),
    marginRight: areaDimen(9),
    marginTop: areaDimen(20),
  },
  applicationRequiredTitle: {
    lineHeight: heightDimen(19),
    fontFamily: Fonts.semibold,
    fontSize: areaDimen(16),
    maxWidth: width / 1.4,
    color: Colors.black,
  },
  applicationRequiredView: {
    padding: areaDimen(12),
    marginTop: areaDimen(19),
    marginHorizontal: areaDimen(22),
    borderRadius: areaDimen(12),
  },
  applicationRequiredText: {
    lineHeight: heightDimen(17),
    fontFamily: Fonts.semibold,
    fontSize: areaDimen(12),
    maxWidth: width / 1.4,
    marginTop: areaDimen(12),
    color: Colors.black,
  },
  cardLockImageStyle: {
    height: areaDimen(75),
    width: areaDimen(75),
    alignSelf: 'center',
    marginBottom:areaDimen(16)
  },
  cardLockTitle: {
    textAlign: 'center',
    alignSelf: 'center',
    color: ThemeManager.colors.textColor,
    fontSize: areaDimen(16),
    fontFamily: Fonts.semibold,
    lineHeight: heightDimen(19),
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
  buttonView: {
    width: width - 40,
    height: heightDimen(60),
    borderRadius: areaDimen(30),
    alignSelf: 'center',
    bottom: areaDimen(36),
    position: 'absolute',
  },
  goToRechargeButton:{
      width: width - 52,
      height: heightDimen(60),
      borderRadius: areaDimen(30),
      alignSelf: 'center',
      marginTop: areaDimen(24),
      marginBottom: areaDimen(24),
  }
});
