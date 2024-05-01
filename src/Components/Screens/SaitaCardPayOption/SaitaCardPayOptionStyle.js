import { StyleSheet, Dimensions } from 'react-native';
import { Images, Colors, Fonts } from '../../../theme';
import fonts from '../../../theme/Fonts';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';

export const styles = StyleSheet.create({
    balanceView: { width: 100, marginRight: 3 },
    card: {
        // backgroundColor: Colors.inputDarkbg,
        borderRadius: 10,
        resizeMode: 'contain',
        borderBottomColor: Colors.borderColor,
        borderBottomWidth: 0.2,
    },
    img: { width: 26, height: 26, resizeMode: 'contain' },
    leftImgStyle: { tintColor: Colors.White },
    rightImgStyle: { tintColor: Colors.White },
    textStyle: {
        fontSize: 15,
        fontFamily: Fonts.semibold,
        color: ThemeManager.colors.textColor,
        marginLeft: 15,
    },
    btnStyle: {
        width: '90%',
        height: 50,
         marginTop:5,
        paddingHorizontal: 20, 
    },


    imgcards: {
         height: "100%", width: "100%",   borderRadius: 20, overflow: 'hidden', alignItems: 'center', justifyContent: 'center',

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
    txtWelcome: { 
        fontFamily: fonts.semibold,
        fontSize: 20,
        alignSelf: 'center',
        textAlign: 'center',  
    },
    txtkyc: { 
        fontFamily: fonts.regular,
        fontSize: 15,
        color:"#989898",
        marginHorizontal:40,
        alignSelf: 'center',
        textAlign: 'center',  
        marginTop:10,
        lineHeight:22
    },
    customGrad: {
        borderRadius: 12,
    },
});
