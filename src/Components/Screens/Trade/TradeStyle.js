import { StyleSheet } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Colors, Fonts } from '../../../theme';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';

export default StyleSheet.create({
    ViewStyle: {
        borderRadius: heightDimen(25),
        borderWidth: 1,
        paddingHorizontal: widthDimen(24),
        height: heightDimen(50),
        justifyContent: 'center'
    },
    ViewBg: {
        borderBottomRightRadius: 25,
        borderBottomLeftRadius: 25,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: widthDimen(22),
        // paddingHorizontal:widthDimen(5),
        // paddingVertical:heightDimen(5),
        marginTop:heightDimen(20),
        padding:areaDimen(1.5),
        borderWidth:1
    },
    txt1: {
        fontSize: areaDimen(14),
        fontFamily: Fonts.medium,
        lineHeight: areaDimen(18),
        textAlign: 'left',
        marginTop: heightDimen(20),
        marginHorizontal: widthDimen(22)
    },
    balanceView: { width: 100, marginRight: 3 },
    card: {
        // backgroundColor: Colors.inputDarkbg,
        borderRadius: 10,
        resizeMode: 'contain',
        borderBottomColor: Colors.borderColor,
        borderBottomWidth: 0.2,
    },
    img: { width: 20, height: 20, resizeMode: 'contain' },
    leftImgStyle: { tintColor: Colors.White },
    rightImgStyle: { tintColor: Colors.White },
    textStyle: {
        fontSize: 15,
        fontFamily: Fonts.semibold,
        color: ThemeManager.colors.textColor,
        marginLeft: 15,
    },
    btnStyle: {
        width: '50%',
        // height: 0,
        marginTop: 0,
        // paddingHorizontal: 15,
        marginVertical: 0,
    },
    SellStyle: {
        width: '50%',
        // height: 0,
        marginTop: 0,
        // paddingHorizontal: 15,
        marginVertical: 0,
    },
    wrap: {
        marginTop: 10,
        marginHorizontal: widthDimen(22)
        // alignItems: 'center'
    },
    txt: {
        fontFamily: Fonts.medium,
        fontSize: areaDimen(14),
        lineHeight: areaDimen(18)
    },
    greyTxt: {
        marginTop: 5,
        fontSize: 10,
        color: ThemeManager.colors.lightTextColor
    },
    MINTxt: {
        color: ThemeManager.colors.textColor,
        textAlign: 'center',
        fontSize: areaDimen(14),
        fontFamily: Fonts.medium,
        lineHeight: areaDimen(18),
        marginTop: heightDimen(20),
        marginHorizontal: widthDimen(22)
    },
    txtInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: areaDimen(40),
        marginVertical: areaDimen(10)
    },
    Number: {
        color: ThemeManager.colors.textColor,
        fontSize: areaDimen(20),
        fontFamily: Fonts.semibold,
        lineHeight: areaDimen(24)
    },
    txtInputWithZero: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: 40,
        marginVertical: 20

    },
    ContinueStyle: {
        // height: 0,
        marginTop: 20,
        // paddingHorizontal: 15,
        marginVertical: 30,
        marginHorizontal:widthDimen(22)
    }

});
