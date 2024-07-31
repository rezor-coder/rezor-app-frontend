import {StyleSheet} from 'react-native';
import {areaDimen, heightDimen, width} from '../../../../Utils/themeUtils';
import {ThemeManager} from '../../../../../ThemeManager';
import {Colors, Fonts} from '../../../../theme';

export const styles = StyleSheet.create({
  cardView: {
    height: heightDimen(210),
    width: width - 42,
    backgroundColor: 'red',
    alignSelf: 'center',
    borderRadius: areaDimen(24),
    overflow: 'hidden',
    marginTop:heightDimen(22)
  },
  box: {
    width: '80%',
    height: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    // overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: ThemeManager.colors.shadowColor,
    shadowOffset: {
      width: 0.2,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.05,
    elevation: 10,
  },
  gradentView: {
    flex: 0.5,
    width: '100%',
    borderTopLeftRadius: areaDimen(17),
    borderTopRightRadius: areaDimen(17),
  },
  iconBg: {
    padding: areaDimen(10),
    borderRadius: areaDimen(12),
    shadowColor: ThemeManager.colors.shadowColor,
    shadowOffset: {
      width: 0.2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.05,
    elevation: 5,
  },
  iconStyle: {height: areaDimen(20), width: areaDimen(20)},
  textStyle: {
    fontSize: areaDimen(14),
    fontFamily: Fonts.semibold,
    lineHeight: heightDimen(18),
    marginTop: areaDimen(6),
  },
  discriptionStyle: {
    fontSize: areaDimen(10),
    fontFamily: Fonts.semibold,
    lineHeight: heightDimen(13),
    // marginTop:areaDimen(9)
  },
  flexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: areaDimen(11),
    marginHorizontal: areaDimen(16),
  },
  likeIcon2: {
    height: areaDimen(12),
    width: areaDimen(12),
    marginRight: areaDimen(4),
  },
  welcomStepView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: areaDimen(17),
    paddingVertical: areaDimen(14),
    marginHorizontal:areaDimen(20)
  },

  manageIconStyle: {
    height: areaDimen(28),
    width: areaDimen(25),
    marginBottom: areaDimen(9),
  },
  cardTextStyle: {
    fontSize: areaDimen(12),
    fontFamily: Fonts.semibold,
    lineHeight: heightDimen(20),
    maxWidth: width / 2,
    textAlign: 'center',
  },
  buttonView: {
    width: '90%',
    height: heightDimen(60),
    borderRadius: areaDimen(30),
    bottom: areaDimen(24),
    position: 'absolute',
    alignSelf:'center'
  },
  buttonText: {
    textAlign: 'center',
    color: Colors.white,
    fontSize: areaDimen(16),
    fontFamily: Fonts.semibold,
  },
  loginView: {
    backgroundColor: 'white',
    position: 'absolute',
    right: 0,
    paddingHorizontal: areaDimen(18),
    paddingVertical: areaDimen(10),
    borderBottomLeftRadius: areaDimen(20),
    borderTopRightRadius: areaDimen(22),
    borderWidth: 1,
    top: areaDimen(0.5),
    overflow: 'hidden',
  },
  logintext: {
    fontFamily: Fonts.semibold,
    color: ThemeManager.colors.textColor,
    fontSize: areaDimen(16),
  },
  cardTitle: {
    fontFamily: Fonts.semibold,
    color: Colors.white,
    fontSize: areaDimen(14),
    lineHeight: heightDimen(18),
    maxWidth: '70%',
  },
  cardSubTitle: {
    fontFamily: Fonts.regular,
    color: Colors.white,
    fontSize: areaDimen(12),
    lineHeight: heightDimen(15),
    marginTop: areaDimen(4),
    maxWidth: '70%',
  },
  cardTitleView: {
    zIndex: 100,
    top: areaDimen(63),
    left: areaDimen(24),
  },
  cardLockImageStyle: {
    height: areaDimen(75),
    width: areaDimen(75),
    alignSelf: 'center',
    marginBottom: areaDimen(16),
    borderRadius:areaDimen(75)
  },
  cardLockTitle: {
    textAlign: 'center',
    alignSelf: 'center',
    color: ThemeManager.colors.textColor,
    fontSize: areaDimen(18),
    fontFamily: Fonts.PoppinsSemiBold,
    lineHeight: heightDimen(27),
    maxWidth: width / 1.2,
  },
  cardLockSubTitle: {
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: areaDimen(14),
    lineHeight: heightDimen(20),
    marginTop: areaDimen(8),
    maxWidth: width / 1.2,
    fontFamily: Fonts.PoppinsRegular,
    opacity:0.6
  },
  goToRechargeButton: {
    width: width - 52,
    height: heightDimen(60),
    borderRadius: areaDimen(10),
    alignSelf: 'center',
    marginTop: areaDimen(24),
    marginBottom: areaDimen(24),
  },
  welcomSecondView: {
    borderBottomRightRadius: areaDimen(12),
    borderBottomLeftRadius: areaDimen(12),
    // overflow: 'hidden',
    marginBottom: areaDimen(10),
   
  },
  indicatorStyle: {
    height: '100%',
    left: areaDimen(-2),
    width: 5,
    backgroundColor: Colors.buttonColor1,
    position: 'absolute',
    borderTopRightRadius: areaDimen(12),
    borderBottomRightRadius: areaDimen(12),
  },
  indicatorLine: {
    position: 'absolute',
    right: '42%',
    zIndex: 0,
  },
  inActiveIndicator: {
    height: areaDimen(16),
    width: areaDimen(16),
    backgroundColor: Colors.skyBlue,
    borderRadius: areaDimen(10),
    zIndex: 1,
    borderWidth: 1,
    borderColor: Colors.powderBlue,
  },
  cardStyle: {
    flex: 0.48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 0.2,
      height: 0.1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.05,
    elevation: 5,
    padding: areaDimen(14),
    height: heightDimen(118),
    borderRadius: areaDimen(16),
  },
  manageIconStyle: {
    height: areaDimen(28),
    width: areaDimen(25),
    marginBottom: areaDimen(9),
  },
  cardTextStyle: {
    fontSize: areaDimen(12),
    fontFamily: Fonts.semibold,
    lineHeight: heightDimen(20),
    maxWidth: width / 2,
    textAlign: 'center',
  },
  buttonView: {
    width: '90%',
    height: heightDimen(60),
    borderRadius: areaDimen(30),
    bottom: areaDimen(24),
    position: 'absolute',
    alignSelf:'center'
  },
  buttonText: {
    textAlign: 'center',
    color: Colors.white,
    fontSize: areaDimen(16),
    fontFamily: Fonts.semibold,
  },
  setpTitleStyle: {
    marginLeft:areaDimen(10),
    fontSize: areaDimen(12),
    fontFamily: Fonts.semibold,
    lineHeight: heightDimen(20),
  },
  likeIcon: {
    height: areaDimen(16),
    width: areaDimen(16),
  },
  cardshimmer:{
    height: heightDimen(118),
    borderRadius: areaDimen(16),
    flex: 0.48,
  },
  stepShimmer:{
    marginBottom: heightDimen(15),
    alignSelf: 'center',
    width: '85%',
    height: heightDimen(60),
    borderRadius: areaDimen(12),
  }
});
