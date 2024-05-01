import { StyleSheet } from 'react-native'
import { Images, Colors, Fonts } from '../../../theme'

export default StyleSheet.create({
    searchBarStyle:{
        backgroundColor:Colors.headerBg,
        borderBottomLeftRadius:22,
        borderBottomRightRadius:22,
        paddingTop:25,
    },
    inputStyle:{
        paddingLeft:55,
        backgroundColor:Colors.searchBoxbg,
    },
    addWallet__style:{
        position:'absolute',
        right:30,
        bottom:25,
    }
})