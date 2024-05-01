import { StyleSheet } from 'react-native';
import { Colors } from '../../../theme';
import { windowWidth } from '../../../Constant';

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.black
    },
    upperTextWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: '15%'
    },
    textSimple: {
        fontSize: 17,
        color: Colors.languageItem
    },
    signupText: {
        fontSize: 22,
        color: Colors.buttonColor1
    },
    forgotPassText: {
        fontSize: 17,
        color: Colors.languageItem,
        alignSelf: 'flex-end',
        right: '10%',
        marginTop: 10
    },
    iconStyle: {
        position: 'absolute',
        width: 22,
        height: 22,
        resizeMode: 'contain',
        top: 43,
        left: '70%'
    },
    btnStyle: {
        width: windowWidth*0.8,
        height: 50,
        marginTop: '15%'
    }
});