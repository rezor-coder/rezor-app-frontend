import { StyleSheet, Dimensions } from 'react-native';
import { Images, Colors, Fonts } from '../../../theme';
import fonts from '../../../theme/Fonts';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';

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
        height: 110,
        width: Dimensions.get('window').width / 3,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    imgcards: {
        // marginTop: -170,
        // height: Dimensions.get('window').height ,
        height: 650,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    imgcards1: {
        height: areaDimen(358),
        width: areaDimen(388),
        resizeMode: 'stretch',
        alignSelf: 'center',
    },
    imgcards2: {
        // marginTop: -170,
        marginBottom: 20,
        height: Dimensions.get('window').height / 5,
        resizeMode: 'contain',
        alignSelf: 'center',
    },

    txtWelcome: {
        color: Colors.White,
        fontFamily: fonts.semibold,
        fontSize: areaDimen(34),
        lineHeight:heightDimen(42),
        alignSelf: 'center',
        textAlign: 'center',
        paddingHorizontal: widthDimen(29),
    },

    txtdescribe: {
        color: ThemeManager.colors.lightTextColor,
        fontFamily: fonts.normal,
        fontSize: areaDimen(14),
        lineHeight:heightDimen(24),
        alignSelf: 'center',
        textAlign: 'center',
        paddingHorizontal: widthDimen(51),
        marginTop: heightDimen(12),
    },
    login: {

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
        marginTop: 20,
    },

    customGrad: {
        borderRadius: 100,
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
});
