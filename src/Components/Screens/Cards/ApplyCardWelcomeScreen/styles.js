import { StyleSheet } from 'react-native'
import {areaDimen, heightDimen, width} from '../../../../Utils/themeUtils';
import { Colors, Fonts } from '../../../../theme';
import { ThemeManager } from '../../../../../ThemeManager';
export const styles = StyleSheet.create({
  mainContainerStyle: {
    flex: 1,
  },
  titleStyle: {
    fontSize: areaDimen(20),
    fontFamily: Fonts.semibold,
    lineHeight: heightDimen(24),
    textAlign: 'center',
    alignSelf: 'center',
    marginVertical: areaDimen(8),
    maxWidth: width / 1.2,
  },
  welcomText: {
    fontSize: areaDimen(20),
    fontFamily: Fonts.semibold,
    lineHeight: heightDimen(24),
    maxWidth: width / 1.2,
    textAlign: 'center',
  },
  welcomSubTitle: {
    fontSize: areaDimen(18),
    fontFamily: Fonts.semibold,
    lineHeight: heightDimen(24),
    maxWidth: width / 1.2,
    textAlign: 'center',
  },
  welcomDecription: {
    fontSize: areaDimen(14),
    fontFamily: Fonts.medium,
    lineHeight: heightDimen(15),
    maxWidth: width / 1.38,
    textAlign: 'center',
    marginTop: areaDimen(10),
  },
  welcomFirstView: {
    alignItems: 'center',
    paddingVertical: areaDimen(24),
    borderTopLeftRadius: areaDimen(12),
    overflow: 'hidden',
    borderTopRightRadius: areaDimen(12),
  },
  welcomCardMailView: {
    // marginTop: areaDimen(24),
    marginHorizontal: areaDimen(24),
  },
  tiltcardStyle: {
    height: areaDimen(80),
    width: areaDimen(120),
    position: 'absolute',
    right: areaDimen(-40),
    top: areaDimen(-36),
    transform:[{rotate:'320deg'}]
  },
  likeIcon: {
    height: areaDimen(16),
    width: areaDimen(16),
  },
  welcomSecondView: {
    borderBottomRightRadius: areaDimen(12),
    borderBottomLeftRadius: areaDimen(12),
    // overflow: 'hidden',
    marginBottom: areaDimen(10),
   
  },
  indicatorStyle: {
    height: '100%',
    left: areaDimen(-17),
    width: 5,
    backgroundColor: Colors.buttonColor1,
    position: 'absolute',
    borderTopRightRadius: areaDimen(12),
    borderBottomRightRadius: areaDimen(12),
  },
  welcomStepView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: areaDimen(17),
    paddingVertical: areaDimen(14),
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

    fontSize: areaDimen(12),
    fontFamily: Fonts.semibold,
    lineHeight: heightDimen(20),
  },
  // ----------------------------------------------------------------
  box: {
    width: '80%', height:'100%',
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
  dotStyle: {
    height: areaDimen(6),
    width: areaDimen(6),
    borderRadius: areaDimen(6),
    marginHorizontal: areaDimen(2),
  },
  dotView: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: areaDimen(24)
  },
  gradentView: {
    flex: 0.5,
    width: '100%',
    borderTopLeftRadius:areaDimen(17),
    borderTopRightRadius:areaDimen(17)
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
});