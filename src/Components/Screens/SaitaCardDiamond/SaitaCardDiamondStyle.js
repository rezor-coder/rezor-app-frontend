// import { StyleSheet, Dimensions } from 'react-native';
// import { Images, Colors, Fonts } from '../../../theme';
// import fonts from '../../../theme/Fonts';
// import { LanguageManager, ThemeManager } from '../../../../ThemeManager';

// export const styles = StyleSheet.create({


//     container: {
//         flex: 1,
//         // backgroundColor: Colors.black,
//     },

//     backTouchable: { marginTop: 44, marginStart: 12, padding: 5 },

//     imgBackStyle: { width: 18, height: 18, resizeMode: 'contain' },

//     imgSaitaPro: {
//         height: 60,
//         width: 140,
//         resizeMode: 'contain',
//         alignSelf: 'center',
//     },
//     imgcards: {
//         height: "100%", width: 210, borderRadius: 20, overflow: 'hidden', alignItems: 'center', justifyContent: 'center'
//     },
//     txtlist: {

//         fontFamily: fonts.semibold,
//         fontSize: 16,
//     },
//     tokenlistActive: {

//         fontFamily: fonts.regular,
//         fontSize: 12,
//     },
//     tokenlistInActive: {
//         color: '#6E737E',
//         fontFamily: fonts.regular,
//         fontSize: 12,
//     },
//     txtviewall: {
//         color: "#EA5AAC",
//         fontFamily: fonts.medium,
//         fontSize: 12,

//     },

//     txtone: {

//         fontFamily: fonts.regular,
//         fontSize: 14,
//     },
//     txttwo: {

//         fontFamily: fonts.bold,
//         fontSize: 30,
//     },
//     txtthree: {

//         color: Colors.lightGrey2,
//         fontFamily: fonts.regular,
//         fontSize: 14,
//     },

//     txtcvv: {
//         color:"rgba(255, 255, 255, 0.5)",
//         fontFamily: fonts.regular,
//         fontSize: 7,
//     },
//     txtdate: {
//         color:Colors.white,
//         fontFamily: fonts.medium,
//         fontSize: 10,
//         marginTop:4
//     },

//     txtdescribe: {
//         color: ThemeManager.colors.lightTextColor,
//         fontFamily: fonts.semibold,
//         fontSize: 16,
//         alignSelf: 'center',
//         textAlign: 'center',
//         paddingHorizontal: 38,
//         marginTop: 10
//     },
//     login: {
//         color: ThemeManager.colors.textColor,
//         fontFamily: fonts.medium,
//         fontSize: 15,
//         alignSelf: 'center',
//         textAlign: 'center',
//         marginTop: 15
//     },

//     btnStyle: {

//         marginTop: 10,
//     },

//     customGrad: {
//         borderRadius: 8,
//         height: 30, width: 70
//     },

//     txtImportWallet: {
//         // color: Colors.White,
//         fontFamily: fonts.semibold,
//         fontSize: 15,
//         alignSelf: 'center',
//         textAlign: 'center',
//         marginTop: 10,
//         padding: 5,
//         marginBottom: 40,
//     },


//     txtCardone: {
//         color: Colors.white,
//         fontFamily: fonts.bold,
//         fontSize: 16,
//     },
//     txtCardred: {
//         color: Colors.red_dark,
//         fontFamily: fonts.semibold,
//         fontSize: 8,
//      },
//     txtCardthree: {

//         color: Colors.lightGrey2,
//         fontFamily: fonts.regular,
//         fontSize: 14,
//     },

//     txtstar: {

//         color: Colors.White,
//         fontFamily: fonts.medium,
//         fontSize: 13,
//         paddingVertical:6
//     },


//     coinsListStyle: {
//         flex: 1,
//         flexDirection: 'row',
//         paddingVertical: 10,
//         marginHorizontal: 20,
//         alignItems: 'center',
//     },
//     balanceViewStyle: {
//         alignSelf: 'flex-end',
//         width: '28%',
//     },
//     balanceViewStylehistory: {
//         alignSelf: 'flex-end',
//         marginHorizontal: 10,
//         width: '50%',
//     },
//     balanceTexthistory: {
//         fontFamily: Fonts.regular,
//         fontSize: 13,
//     },
//     coinPriceStylehistory: {
//         fontSize: 11,
//         fontFamily: Fonts.regular,
//     },
//     balanceText: {
//         alignSelf: 'flex-end',
//         fontFamily: Fonts.regular,
//         textAlign: 'right',
//         fontSize: 13,
//     },
//     coinStyle: {
//         height: 30,
//         width: 30,
//         borderRadius: 15,
//     },
//     coinPriceStyle: {
//         alignSelf: 'flex-end',
//         fontSize: 11,
//         fontFamily: Fonts.regular,
//     },
//     graphImage: {
//         height: 40,
//         width: 150,
//         resizeMode: 'contain',
//     },
//     coinListWrapStyle: {
//         marginTop: 15,
//         paddingBottom: 70,
//         flexGrow: 1,
//         marginHorizontal: 10
//     },
//     noCoinText: {
//         color: ThemeManager.colors.textColor,
//         textAlign: 'center',
//         marginTop: 30,
//         fontSize: 16,
//     },
//     coinNameStyle: {
//         height: 30,
//         width: 30,
//         backgroundColor: Colors.buttonColor2,
//         alignItems: 'center',
//         justifyContent: 'center',
//         borderRadius: 40,
//     },
//     fiatText: {
//         color: Colors.lightGrey2,
//         fontFamily: Fonts.regular,
//         fontSize: 11,
//     },
//     graphStyle: {
//         width: '25%',
//         marginRight: 10,
//         alignSelf: 'flex-start',
//     },
//     manageBtnStyle: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         flexDirection: 'row',
//     },
//     manageBtnImg: {
//         height: 14,
//         width: 14,
//         resizeMode: 'contain',
//         tintColor: ThemeManager.colors.textColor,
//         marginRight: 5,
//     },
//     assetsText: {
//         color: ThemeManager.colors.textColor,
//         fontSize: 16,
//         fontFamily: fonts.semibold,
//     },
//     subView: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginTop: 15,
//         marginHorizontal: 15
//     },
//     subContainer: {
//         width: '100%',
//         marginTop: 20,
//         borderRadius: 10,
//         justifyContent: 'center',
//         paddingVertical: 5,
//     },
//     flexRow: { flexDirection: 'row', justifyContent: 'space-evenly' },
//     okText: {
//         color: Colors.white,
//         fontSize: 16,
//         fontFamily: fonts.regular,
//         // marginTop:-2,
//         marginTop: 2
//     },
//     refreshBtn: {
//         alignSelf: 'flex-end',
//         marginTop: -30,
//         marginRight: -10,
//     },
// });
import { StyleSheet, Dimensions } from 'react-native';
import { Images, Colors, Fonts } from '../../../theme';
import fonts from '../../../theme/Fonts';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { windowWidth } from '../../../Constant';
const win = Dimensions.get('window').width;
const imgw = win - 180


export const styles = StyleSheet.create({
    BYsaita: {
        height: 33,
        width: 30,

        resizeMode: 'contain',

        alignSelf: 'center',
    },
    ViewStyle: {
        marginLeft: 10, alignItems: 'center', flexDirection: 'row'
    },
    disableBtnStyle: {
        width: '85%',
        height: 50,
        // marginTop: 35,
        marginTop: 30,
        backgroundColor: ThemeManager.colors.defiBgColor,
        borderRadius: 12,
        justifyContent: 'center'
    },
    InaCtiveText: {
        color: Colors.red_dark,
        fontFamily: fonts.semibold,
        fontSize: 14,
        textDecorationLine: 'underline'
    },
    cardName: {
        color: Colors.White,
        fontFamily: fonts.bold,
        fontSize: 14,
        textTransform: 'capitalize'
    },
    activeCardName: {
        // backgroundColor: 'rgba(57, 57, 57, 0.7)',
        borderRadius: 17,
        height: 150,
        // width: 230,
        justifyContent: 'center',
        padding: 10,
    },
    centerLottie: {
        height: 250,
        width: 300,
        resizeMode: 'stretch',

        alignSelf: 'center',
    },

    container: {
        flex: 1,
        // backgroundColor: Colors.black,
    },

    backTouchable: { marginTop: 44, marginStart: 12, padding: 5 },

    imgBackStyle: { width: 18, height: 18, resizeMode: 'contain' },

    imgSaitaPro: {
        height: 60,
        width: 140,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    imgcards: {
        height: "100%", width: "100%", borderRadius: 25, overflow: 'hidden', alignItems: 'center', justifyContent: 'center',
    },

    txtone: {
        color: Colors.White,
        fontFamily: fonts.semibold,
        fontSize: 8,
    },
    txttwo: {
        color: "#8F939E",
        fontFamily: fonts.bold,
        fontSize: 14, textDecorationLine: 'line-through',
        textDecorationStyle: 'solid'
    },
    txtthree: {

        color: Colors.White,
        fontFamily: fonts.bold,
        fontSize: 16,
    },

    txtdescribe: {
        color: ThemeManager.colors.lightTextColor,
        fontFamily: fonts.semibold,
        fontSize: 16,
        alignSelf: 'center',
        textAlign: 'center',
        paddingHorizontal: 38,
        marginTop: 28,
    },
    login: {

        fontFamily: fonts.medium,
        fontSize: 15,
        alignSelf: 'center',
        textAlign: 'center',
        marginTop: 22
    },

    btnStyle: {
        width: '100%',
        height: 50,
        // marginTop: 35,
        paddingHorizontal: 32,
        marginTop: 30,
    },

    customGrad: {
        borderRadius: 12,
    },

    txtImportWallet: {
        // color: Colors.White,
        fontFamily: fonts.semibold,
        fontSize: 15,
        alignSelf: 'center',
        textAlign: 'center',
        marginTop: 10,
        padding: 5,
        marginBottom: 40,
    },










    txtlist: {

        fontFamily: fonts.semibold,
        fontSize: 16,
    },
    tokenlistActive: {

        fontFamily: fonts.regular,
        fontSize: 12,
    },
    tokenlistInActive: {
        color: '#6E737E',
        fontFamily: fonts.regular,
        fontSize: 12,
    },
    txtviewall: {
        color: "#EA5AAC",
        fontFamily: fonts.medium,
        fontSize: 12,

    },

    txtonecard: {

        fontFamily: fonts.regular,
        fontSize: 14,
    },
    txttwocard: {

        fontFamily: fonts.bold,
        fontSize: 30,
    },
    txtthreecard: {

        color: Colors.lightGrey2,
        fontFamily: fonts.regular,
        fontSize: 14, marginTop: 12
    },

    txtcvv: {
        color: "rgba(255, 255, 255, 0.5)",
        fontFamily: fonts.regular,
        fontSize: 10,
    },
    txtdate: {
        color: Colors.white,
        fontFamily: fonts.ocr,
        fontSize: 16,
        marginTop: 4,
        letterSpacing:1
    },

    txtdescribe: {
        color: ThemeManager.colors.lightTextColor,
        fontFamily: fonts.semibold,
        fontSize: 16,
        alignSelf: 'center',
        textAlign: 'center',
        paddingHorizontal: 38,
        marginTop: 10
    },
    login: {
        color: ThemeManager.colors.textColor,
        fontFamily: fonts.medium,
        fontSize: 15,
        alignSelf: 'center',
        textAlign: 'center',
        marginTop: 15
    },

    btnStylecard: {

        marginTop: 10,
    },

    customGradCard: {
        borderRadius: 8,
        height: 30, width: 70
    },

    txtImportWallet: {
        // color: Colors.White,
        fontFamily: fonts.semibold,
        fontSize: 15,
        alignSelf: 'center',
        textAlign: 'center',
        marginTop: 10,
        padding: 5,
        marginBottom: 40,
    },
    eyeStyle: {
        position: 'absolute',
        alignSelf: 'flex-end',
        top: 40,
        right: 45,
        zIndex: 1,
        padding: 5
    },
    txtCardone: {
        color: Colors.white,
        fontFamily: fonts.medium,
        fontSize: 21,
        textTransform: 'capitalize'
    },
    txtCardred: {
        color: Colors.lighttxt,
        fontFamily: fonts.medium,
        fontSize: 12,
    },
    txtCardthree: {

        color: Colors.lightGrey2,
        fontFamily: fonts.regular,
        fontSize: 14,
    },

    txtstar: {

        color: Colors.White,
        fontFamily: fonts.ocr,
        fontSize: 16,
        paddingVertical: 10,
        letterSpacing:1
    },
    coinsListStyle: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        marginHorizontal: 10,
        alignItems: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    balanceViewStyle: {
        alignSelf: 'flex-end',
        width: '28%',
    },
    balanceViewStylehistory: {
        alignSelf: 'flex-end',
        marginHorizontal: 10,
        width: '50%',
    },
    balanceTexthistory: {
        fontFamily: Fonts.regular,
        fontSize: 13,
    },
    coinPriceStylehistory: {
        fontSize: 11,
        fontFamily: Fonts.regular,
    },
    balanceText: {
        alignSelf: 'flex-end',
        fontFamily: Fonts.regular,
        textAlign: 'right',
        fontSize: 13,
    },
    coinStyle: {
        height: 30,
        width: 30,
        borderRadius: 15,
    },
    coinPriceStyle: {
        alignSelf: 'flex-end',
        fontSize: 11,
        fontFamily: Fonts.regular,
    },
    graphImage: {
        height: 40,
        width: 150,
        resizeMode: 'contain',
    },
    coinListWrapStyle: {
        marginTop: 15,
        paddingBottom: 70,
        flexGrow: 1,
        marginHorizontal: 10
    },
    noCoinText: {
        color: ThemeManager.colors.textColor,
        textAlign: 'center',
        marginTop: 30,
        fontSize: 16,
    },
    coinNameStyle: {
        height: 30,
        width: 30,
        backgroundColor: Colors.buttonColor2,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 40,
    },
    fiatText: {
        color: Colors.lightGrey2,
        fontFamily: Fonts.medium,
        fontSize: 11,
        marginLeft: 1,
        textAlign: 'center',
        textTransform: 'capitalize'
    },
    graphStyle: {
        width: '30%',
        marginRight: 10,
        alignSelf: 'flex-start',
    },
    ViewStyle1: {
        marginLeft: 10, alignItems: 'center', flexDirection: 'row',
    },
    manageBtnStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    manageBtnImg: {
        height: 14,
        width: 14,
        resizeMode: 'contain',
        tintColor: ThemeManager.colors.textColor,
        marginRight: 5,
    },
    assetsText: {
        color: ThemeManager.colors.textColor,
        fontSize: 16,
        fontFamily: fonts.semibold,
    },
    subView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        marginHorizontal: 15
    },
    subContainer: {
        width: '100%',
        marginTop: 20,
        borderRadius: 10,
        justifyContent: 'center',
        paddingVertical: 5,
    },
    flexRow: { flexDirection: 'row', justifyContent: 'space-evenly' },
    okText: {
        color: Colors.white,
        fontSize: 16,
        fontFamily: fonts.regular,
        // marginTop:-2,
        marginTop: 2
    },
    refreshBtn: {
        alignSelf: 'flex-end',
        marginTop: -30,
        marginRight: -10,
    },
    txtWelcome: {
        fontFamily: fonts.semibold,
        fontSize: 20,
        alignSelf: 'center',
        textAlign: 'center',
    },
    txtkyc: {
        fontFamily: fonts.regular,
        fontSize: 15,
        color: "#989898",
        marginHorizontal: 40,
        alignSelf: 'center',
        textAlign: 'center',
        marginTop: 10,
        lineHeight: 22
    },
    customGrad: {
        borderRadius: 12,
    },
    btnStylekyc: {
        width: windowWidth * 0.8,
        height: 50,
        marginTop: '15%',
    },
    textStylee: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        color: ThemeManager.colors.stakeColor,
        textTransform: 'capitalize'
    }, imgCopyInside: {
        height: 15,
        width: 15, marginLeft:5
    },
});
