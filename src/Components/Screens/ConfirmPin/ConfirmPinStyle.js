import { StyleSheet } from 'react-native'
import { Images, Colors, Fonts } from '../../../theme'

export default StyleSheet.create({
    mainView: {
        backgroundColor: Colors.Darkbg,
        flex: 1,
        alignItems: 'center',
        
    },
    textInputView: { paddingTop: 40 },
    textInput: {
        alignSelf: 'flex-start',
        marginLeft: -10
    },
    pinText: {
        color: '#fff',
        fontSize: 16,
        fontFamily:fonts.regular
    },
    inputView: { paddingTop: 30 },
    confiemPinView: {
        paddingTop: 60,
        paddingBottom: 65
    },
    btnStyle: {
        alignSelf: 'center',
        height: 50, width: 280,
        alignSelf: 'center'
    },
    cellStyle: {
        borderWidth: 1,
        borderRadius: 4,
        width: 35,
        height: 60,
        borderColor: '#fff',
        marginLeft: 10,
    },
    inputText: {
        fontSize: 20,
        color: '#fff'
    },
    cellFocus: { borderColor: '#fff' },
    createPinTxt: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
        fontFamily:fonts.regular
    },
    text: {
        color: Colors.fadetext,
        alignSelf: 'center',
        fontFamily:fonts.regular
    },
    btnView2: {
        marginTop: 30,
        alignSelf: 'center',
        height: 40,
        width: 50,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 7,
    },

    
})