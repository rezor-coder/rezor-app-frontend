import { Col } from 'native-base';
import { StyleSheet } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Colors, Fonts } from '../../../theme';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
    innerContainer: {
        flex: 0.7,
        backgroundColor: Colors.black,
        height: '100%',
        marginHorizontal: widthDimen(22),
        alignItems: 'center'
    },
    bottomContainer: {
        flex: 1,
        backgroundColor: Colors.black,
        height: '100%',
        marginHorizontal: widthDimen(22),
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    priceInput: {
        color: 'white',
        fontSize: areaDimen(14),
        fontFamily: Fonts.medium,
    },
    numOfCoins: {
        fontSize: 12,
        fontFamily: Fonts.semibold,
        color: Colors.buyCoinColor
    },
    btnStyle: {
        width: '100%',
        height: heightDimen(60),
        marginBottom: heightDimen(10)
    },
    customGrad: {
        borderRadius: heightDimen(30)
    },

    label: {
        marginTop: heightDimen(24),
        marginBottom: heightDimen(10),
        alignSelf: 'flex-start',
        fontSize: areaDimen(14),
        fontFamily: Fonts.medium,
    },
    noteStyle: {
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: areaDimen(12),
        fontFamily: Fonts.regular,
        color: Colors.white,
        marginBottom: heightDimen(10),
        marginTop: heightDimen(20),
    },

    btnStylen: {
        fontFamily: Fonts.regular,
        justifyContent: 'flex-end',
        // backgroundColor:"#232531",
        borderWidth: 0,
        alignSelf: 'stretch',
        width: '100%',
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 20
    },
    btnTextStyle: {
        fontFamily: Fonts.regular,
        fontSize: 16,
        color: Colors.White,
        textAlign: 'left',
    },
    dropDownStyle: {
        backgroundColor:"#292929", 
        borderRadius: 10,
        shadowColor: "#fff",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,

    },
    rowStyle: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.04)',
        paddingLeft: 20,
    },
    rowTextStyle: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        textAlign: 'left'
    },
});