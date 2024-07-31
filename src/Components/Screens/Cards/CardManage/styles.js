import {StyleSheet} from 'react-native';
import { areaDimen, heightDimen, width, widthDimen } from '../../../../Utils/themeUtils';
import { ThemeManager } from '../../../../../ThemeManager';
import { Colors, Fonts } from '../../../../theme';


export const styles = StyleSheet.create({
  mainContainerStyle: {
    flex: 1,
  },
  borderLineStyle: {
    height: heightDimen(1),
    backgroundColor: ThemeManager.colors.borderColor,
  },
  cardInnerView: {
    zIndex: 100,
    // top: areaDimen(61),
    paddingTop: areaDimen(61),
    height: '100%',
  },
  categoryMainView: {
    justifyContent: 'space-between',
    paddingHorizontal: areaDimen(22),
    marginVertical: areaDimen(24),
  },
  categoryView: {
    height: heightDimen(80),
    width: width / 5,
    borderWidth: 1,
    borderRadius: areaDimen(12),
    borderColor: ThemeManager.colors.lightBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconStyle: {
    height: areaDimen(22),
    width: areaDimen(22),
  },
  categoryTextStyle: {
    lineHeight: heightDimen(15),
    marginTop: areaDimen(15),
    color: ThemeManager.colors.primary,
    fontFamily: Fonts.medium,
    fontSize: areaDimen(12),
  },
  cardInfoDetailView: {
    borderWidth: 1,
    marginHorizontal: areaDimen(22),
    borderColor: ThemeManager.colors.lightBlue,
    paddingVertical: areaDimen(12),
    borderRadius: areaDimen(12),
    marginTop: areaDimen(6),
  },
  cardInfoTitle: {
    lineHeight: heightDimen(15),
    fontFamily: Fonts.semibold,
    fontSize: areaDimen(12),
    color: ThemeManager.colors.inActiveColor,
    flex: 0.4,
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
  flexRowJustify: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: areaDimen(24),
  },
  cardInfoText: {
    lineHeight: heightDimen(19),
    fontFamily: Fonts.semibold,
    fontSize: areaDimen(16),
   
    marginHorizontal: areaDimen(12),
    marginBottom: areaDimen(16),
  },
  rightArrowStyle: {
    height: areaDimen(24),
    width: areaDimen(24),
  },
  faqView: {
   
    borderRadius: areaDimen(12),
    marginVertical: areaDimen(16),
    marginHorizontal: areaDimen(22),
    padding: areaDimen(12),
  },
  faqText: {
    lineHeight: heightDimen(15),
    fontFamily: Fonts.semibold,
    fontSize: areaDimen(12),
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gradientView: {
    position: 'absolute',
    bottom: 0,
    zIndex: 200,
    paddingHorizontal: areaDimen(22),
    paddingVertical: areaDimen(11),
    borderTopRightRadius: areaDimen(20),
    borderWidth: 1,
    borderBottomLeftRadius: areaDimen(17),
  },
  cardName: {
    lineHeight: heightDimen(18),
    fontFamily: Fonts.regular,
    fontSize: areaDimen(14),
    color: Colors.White,
    paddingHorizontal: areaDimen(24),
  },
  cardNumber: {
    lineHeight: heightDimen(22),
    fontFamily: Fonts.semibold,
    fontSize: areaDimen(18),
    color: Colors.White,
    paddingHorizontal: areaDimen(24),
    marginTop: areaDimen(50),
  },
  cardBrand: {
    lineHeight: heightDimen(19),
    fontFamily: Fonts.semibold,
    fontSize: areaDimen(16),
    color: Colors.White,
  },
  replaceCardTitle: {
   
    fontSize: areaDimen(16),
    fontFamily: Fonts.semibold,
    lineHeight: heightDimen(19),
  },
  replaceReson: {
    color: Colors.fadeDot,
    fontSize: areaDimen(14),
    fontFamily: Fonts.semibold,
    lineHeight: heightDimen(19),
    marginTop: areaDimen(12),
    marginBottom: areaDimen(2),
  },
  replaceResonTextView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: areaDimen(8),
    padding: areaDimen(16),
    borderRadius: areaDimen(12),
  },
  replaceResonTitle: {
    fontSize: areaDimen(14),
    fontFamily: Fonts.semibold,
    lineHeight: heightDimen(19),
  },
  blueTickIcon: {
    height: heightDimen(10),
    width: widthDimen(14),
  },
  buttonView: {
    width: '100%',
    height: heightDimen(60),
    borderRadius: areaDimen(30),
    marginTop: areaDimen(24),
  },
  buttonText: {
    textAlign: 'center',
    color: Colors.white,
    fontSize: areaDimen(16),
    fontFamily: Fonts.semibold,
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
  setAtmPinText:{
    color: ThemeManager.colors.textColor,
    fontSize: areaDimen(16),
    fontFamily: Fonts.semibold,
    lineHeight: heightDimen(19),
    maxWidth: width / 1.2,
  },
  setAtmPinDiscriptionText:{
    color: ThemeManager.colors.inActiveColor,
    fontSize: areaDimen(12),
    fontFamily: Fonts.semibold,
    lineHeight: heightDimen(15),
    maxWidth: width / 1.2,
    marginVertical:areaDimen(18)
  },
  sliderStyle:{
    height: areaDimen(11),
    justifyContent: 'flex-start',
    width: width - 18,
    alignSelf: 'center',
    marginTop:areaDimen(19)
  },
  spendLimitText:{
    color: ThemeManager.colors.textColor,
    fontSize: areaDimen(16),
    fontFamily: Fonts.semibold,
    lineHeight: heightDimen(18),
    // marginTop:areaDimen(8)
  },
  rangeTextStyle:{
    color: ThemeManager.colors.inActiveColor,
    fontSize: areaDimen(12),
    fontFamily: Fonts.semibold,
    lineHeight: heightDimen(15),
    marginTop:areaDimen(9)
  },
  subTextStyle:{
    color: ThemeManager.colors.inActiveColor,
    fontSize: areaDimen(12),
    fontFamily: Fonts.semibold,
    lineHeight: heightDimen(15),
    marginTop:areaDimen(24)
  }
});
