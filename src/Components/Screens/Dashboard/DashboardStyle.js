import { StyleSheet, Dimensions } from 'react-native';
import { Fonts, Colors, Images } from '../../../theme/';
const win = Dimensions.get('window').width;
import { windowWidth } from '../../../Constant';
import { ThemeManager } from '../../../../ThemeManager';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';

export default StyleSheet.create({

    sliderImgStyle: { height: '100%' },
    sliderTxtStyle: { marginLeft: 20, marginTop: 15, fontSize: 28, letterSpacing: -1.8, color: Colors.white, },
    sliderTxtStyle1: { marginLeft: 20, marginTop: 8, fontSize: 9, letterSpacing: -0.75, color: Colors.white, },
    joinUsStyle: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginRight: 20 },
    navBarActiveBg: {
        backgroundColor: Colors.tabBgColor,
    },
    nocoinView: { alignItems: 'center', justifyContent: 'center' },
    listRowView: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginRight: 20,
    },
    mapView: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        marginTop: 10,
    },
    navTextStyle: {
        fontFamily: Fonts.regular,
        color: Colors.textColor, fontSize: 16,
        textAlign: 'center', letterSpacing: -1.52
    },
    navTextActiveStyle: {
        fontFamily: Fonts.regular,
        fontWeight: '400',
        color: Colors.activeText, fontSize: 16,
        textAlign: 'center',
        letterSpacing: -1.52
    },
    charAtimg: {
        height: 35, width: 35, backgroundColor: Colors.buttonColor2,
        alignItems: 'center', justifyContent: "center", borderRadius: 40, marginRight: 10
    },

    navBarUnderlineBg: {
        backgroundColor: 'transparent',
    },

    navBarBg: {
        backgroundColor: Colors.tabBgColor,

    },
    carouselBack: { marginLeft: 0, marginRight: 0, width: "100%", height: 200, marginTop: "3%", },
    carouselOneBack: { marginLeft: 0, marginRight: 0, width: "100%", height: 200, marginTop: "3%", alignItems: 'center', justifyContent: "center", },


    txtWelcome: {
        fontFamily: Fonts.semibold,
        fontSize: 20,
        alignSelf: 'center',
        textAlign: 'center',
    },
    txtkyc: {
        fontFamily: Fonts.regular,
        fontSize: 15,
        color: "#989898",
        marginHorizontal: 40,
        alignSelf: 'center',
        textAlign: 'center',
        marginTop: 10,
        lineHeight: 25
    },

    btnStylekyc: {
        width: windowWidth * 0.8,
        height: 50,
        marginTop: '15%',
    },
    noCoinText: {

        textAlign: 'center',
        fontFamily: Fonts.regular,
        fontSize: areaDimen(16),
    },
    buyButton: {
        minHeight: heightDimen(26),
        minWidth: widthDimen(57),
        borderRadius: 100,
        backgroundColor: ThemeManager.colors.primary,
        paddingHorizontal: widthDimen(16),
        paddingVertical: heightDimen(5),
        marginLeft: widthDimen(6),
    },
    buyText: {
        color: Colors.white,
        fontFamily: Fonts.medium,
        fontSize: areaDimen(12),
        lineHeight: areaDimen(15),
    },
    stakeText: {
        color: ThemeManager.colors.inActiveColor,
        fontFamily: Fonts.medium,
        fontSize: areaDimen(12),
        lineHeight: areaDimen(15),
    },
    stakeButton: {
        minHeight: heightDimen(26),
        minWidth: widthDimen(57),
        borderRadius: 100,
        paddingHorizontal: widthDimen(16),
        paddingVertical: heightDimen(5),
        borderWidth: areaDimen(0.8),
        borderColor: ThemeManager.colors.inActiveColor,
    },
    coinNameStyle: {
        color: ThemeManager.colors.textColor,
        fontFamily: Fonts.medium,
        fontSize: areaDimen(16),
        lineHeight: areaDimen(19),
        marginBottom: heightDimen(4),
    },
    coinFamilyText: {
        fontSize: areaDimen(13),
        lineHeight: areaDimen(19),
        textTransform: 'none',

    },
    coinBalanceText: {
        fontFamily: Fonts.medium,
        fontSize: areaDimen(14),
        lineHeight: areaDimen(18),
    },
    imageNameContainer:{
        height: areaDimen(38),
        width: areaDimen(38),
        
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: areaDimen(40),
      },
      cardMain:{
        minHeight: heightDimen(70),
        borderRadius: areaDimen(12),
        marginHorizontal: widthDimen(20),
        marginTop: heightDimen(10),
        backgroundColor: ThemeManager.colors.iconBg,
        paddingHorizontal: widthDimen(12),
        paddingVertical: heightDimen(12),
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: ThemeManager.colors.shadowColor,
        shadowOffset: {
          width: 0.2,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.05,
        elevation: 4,
      }
});
