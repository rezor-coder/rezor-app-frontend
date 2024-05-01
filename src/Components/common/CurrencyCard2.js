
import React from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { ThemeManager } from '../../../ThemeManager';

import { Images } from '../../theme';
import colors from '../../theme/Colors';
import fonts from '../../theme/Fonts';
import { areaDimen, heightDimen, widthDimen } from '../../Utils/themeUtils';

const CurrencyCard2 = (props) => {

    return (
        <TouchableOpacity disabled={props.disabled}onPress={props.onPress} style={[props.styleNew, styles.card,{backgroundColor:ThemeManager.colors.mnemonicsView,borderRadius:10}]}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image style={props.style} source={props.image} resizeMode='contain'/>
            </View>
            <View style={{ paddingHorizontal: widthDimen(12),flex:1 }}>

                <Text allowFontScaling={false}style={[styles.addTextStyle,{color:ThemeManager.colors.textColor}]} >{props.appName}</Text>
                <Text allowFontScaling={false}style={[styles.textStyle,{color:ThemeManager.colors.inActiveColor+'95'}]}>{props.address}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image source={Images.arrow} style={{ tintColor: colors.blueTextColor, }} />
            </View>

        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    textStyle: { fontSize: areaDimen(12),lineHeight:heightDimen(15), fontFamily: fonts.medium, color:ThemeManager.colors.inActiveColor },
    card: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: widthDimen(16),paddingVertical:heightDimen(14),shadowColor: ThemeManager.colors.shadowColor,
    shadowOffset: {
        width: 0,
        height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.05,
    elevation: 4, },
    addTextStyle: { fontSize: areaDimen(16),lineHeight:heightDimen(17), fontFamily: fonts.semibold, color: ThemeManager.colors.textColor },
});
export default CurrencyCard2;
