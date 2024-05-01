import { StyleSheet } from "react-native";
import { Fonts } from "../../../theme";
import { heightDimen, widthDimen, areaDimen } from "../../../Utils/themeUtils";

const styles=StyleSheet.create({
    box:{ position: 'relative', height: heightDimen(133), width: widthDimen(370), alignSelf: 'center', marginTop: heightDimen(47),borderRadius:areaDimen(25) },
    coinBalanceStyle:{marginTop:heightDimen(35),fontFamily:Fonts.semibold, fontSize:areaDimen(24),lineHeight:heightDimen(29),alignSelf:'center'},
    coinBalanceFiatStyle:{marginTop:heightDimen(6),fontFamily:Fonts.semibold, fontSize:areaDimen(14),lineHeight:heightDimen(18),alignSelf:'center'},
    coinImage:{position:'absolute',height:areaDimen(50),width:widthDimen(50),borderRadius:areaDimen(50),top:-areaDimen(25),alignSelf:'center'},
    optionsImage:{height:heightDimen(16),width:widthDimen(18),},
    optionBg:{height:areaDimen(50),width:areaDimen(50),borderRadius:100,justifyContent:'center',alignItems:'center',position:'relative'},
    optionText:{position:'absolute',bottom:heightDimen(-20),width:'120%',alignSelf:'center',textAlign:'center',fontSize:areaDimen(12),lineHeight:heightDimen(15),fontFamily:Fonts.semibold},
    trxHistoryText:{marginHorizontal:widthDimen(22), fontSize:areaDimen(16),lineHeight:heightDimen(19),fontFamily:Fonts.semibold,marginTop:heightDimen(75)},
    notFound:{fontSize:areaDimen(16),lineHeight:heightDimen(19),fontFamily:Fonts.regular}
})
export default styles