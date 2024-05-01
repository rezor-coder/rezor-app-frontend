import { Dimensions, StyleSheet } from 'react-native'
import { ThemeManager } from '../../../../ThemeManager';
import { Images, Colors, Fonts } from '../../../theme'
import colors from '../../../theme/Colors'
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';

export default StyleSheet.create({
    container: { flex: 1, backgroundColor:ThemeManager.colors.bg },
    headTextStyle: { paddingHorizontal: widthDimen(43), fontFamily: Fonts.semibold, color: ThemeManager.colors.textColor, fontSize: areaDimen(16), textAlign: 'center',lineHeight:heightDimen(26) },
    innerContainer: { flex: 1,  paddingVertical: heightDimen(20),justifyContent:'space-between' },
    connect: { width: "80%", alignSelf: "center", marginTop: 15 },
    walletListingStyle: {
        justifyContent: "space-between",
        borderRadius: 10,
    },
    cameraAbsoluteView: { position: 'absolute', zIndex: -999, flex: 1, },
    absoluteView: {
        height: Dimensions.get('screen').height > 900 ? '95%' : '100%',
        width: Dimensions.get('screen').height > 900 ? '97%' : '100%',
        zIndex: 999,
        top: 0,
        resizeMode: 'stretch',
        alignSelf: 'center',
        marginTop: Dimensions.get('screen').height > 900 ? heightDimen(20) : 0
    },
    walletListingTextStyle: {
        fontFamily: Fonts.medium,
        color: ThemeManager.colors.textColor,
        // paddingBottom: 10,
        paddingHorizontal: widthDimen(20),
        // marginTop:heightDimen(20)
    },
    modalViewStyle: {
        flex: 1,
        backgroundColor: Colors.screenWhite,
        // paddingTop: Platform.OS == "ios" ? 50 : 20,
    },
    connectModalViewStyle: {
        flex: 1,
        // marginBottom:-40,
        // paddingTop: Platform.OS == "ios" ? 50 : 20,
    },
    appNameStyle: {
        fontFamily: Fonts.semibold,
        color: ThemeManager.colors.textColor,
        textAlign: "center",
        marginTop: heightDimen(10),
        fontSize:areaDimen(20),
        lineHeight:heightDimen(24)

    },
    currencyCardStyle: {
        backgroundColor: ThemeManager.colors.wcbackground,
        paddingVertical: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        marginTop: 10,
        borderRadius: 10,
        marginHorizontal: 20
    },
    currencyCardStyle2: {
backgroundColor:ThemeManager.colors.wcbackground,
        paddingVertical: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        marginBottom:heightDimen(10),
    },

})