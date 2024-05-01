import { StyleSheet } from 'react-native'
import { Images, Colors, Fonts } from '../../../theme'
import fonts from '../../../theme/Fonts';

export const styles = StyleSheet.create({
    roundView:
    {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        flex: 1,
        backgroundColor: 'black',
        paddingVertical: 30
    },
    btnStyle: {
        height: 23,
        width: 100,
        marginLeft: 40


    },
    addWalletView:
    {
        backgroundColor: Colors.inputDarkbg,
        marginTop: 25,
        borderRadius: 4
    },
    addressView:
    {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50
    },
    pastetxt:
    {
        color: Colors.fadeDot,
        textAlign: 'center'
    },
    scanView:
    {
        marginLeft: 10,
        marginRight: 20,
        alignSelf: 'center'
    },
    iconstyle:
    {
        height: 20,
        width: 20,
        resizeMode: 'contain',
        tintColor: Colors.fadeDot
    },
    line:
    {
        backgroundColor: '#000000',
        height: 2,
        alignSelf: 'center',
        marginHorizontal: 15,
        width: 300
    },
    networkView:
    {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50
    },
    nettxt:
    {
        paddingLeft: 20,
        color: Colors.fadeDot,
        fontSize: 16,
        fontFamily: fonts.normal
    },
    downiconview:
    {
        alignItems: 'center',
        marginHorizontal: 10
    },
    downiconstyle:
    {
        height: 12,
        width: 12,
        resizeMode: 'contain'
    },
    savebtn: {
        height: 50, width: '99%',
        alignSelf: 'center',
    },
    tokenItem: {
        // borderWidth: 1,
        // borderColor: Colors.lossText,
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginVertical: 5,
        marginHorizontal: 15,
        // alignItems: 'stretch',
        backgroundColor: Colors.headerBg,
        // elevation: 5
    },
    viewStyle: {
        flexDirection: 'row',
        flex: 1,
        // justifyContent: 'space-between'
    },
});