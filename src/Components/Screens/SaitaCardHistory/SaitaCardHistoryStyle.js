import { StyleSheet, Dimensions } from 'react-native';
import { Images, Colors, Fonts } from '../../../theme';
import fonts from '../../../theme/Fonts';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';

export const styles = StyleSheet.create({
    BYsaita: {
        height: 33,
        width: 30,

        resizeMode: 'contain',

        alignSelf: 'center',
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
        height: "100%", width: 210, borderRadius: 20, overflow: 'hidden', alignItems: 'center', justifyContent: 'center'
    },

    txtone: {
        color: Colors.White,
        fontFamily: fonts.semibold,
        fontSize: 8,
    },
    txttwo: {
        color: "#8F939E",
        fontFamily: fonts.bold,
        fontSize: 14,
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



    coinsListStyle: {
        // flex: 1,
        flexDirection: 'row',
        paddingVertical: 10,
        marginHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    balanceViewStyle: {
        alignSelf: 'flex-end',
        width: '28%',
    },
    balanceViewStylehistory: {

        flex: 1,
        alignItems: 'flex-end'

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
    },
    graphStyle: {


        justifyContent: 'flex-end',
    },
    manageBtnStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
});
