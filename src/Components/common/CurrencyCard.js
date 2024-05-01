
import React from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { ThemeManager } from '../../../ThemeManager';
import fonts from '../../theme/Fonts';
import { areaDimen, heightDimen, widthDimen } from '../../Utils/themeUtils';
const CurrencyCard = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress} style={[props.styleNew, styles.card, { backgroundColor: ThemeManager.colors.mnemonicsView }]} disabled={props.disabled}>
            <View style={{ flexDirection: "row", alignItems: "center", }}>
                <Image style={props.style} source={props.image} />
                <View style={{ paddingLeft: widthDimen(12) }}>
                    <Text allowFontScaling={false} style={[styles.textStyle, { color: ThemeManager.colors.textColor }, props.textStyle]}>{props.blockChain}</Text>
                    <Text allowFontScaling={false} style={[styles.addTextStyle, { color: ThemeManager.colors.inActiveColor }, props.addStyle]}>{props?.address?.substring(0, 20) +
                        '....' +
                        props?.address?.substring(20 + 18)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    textStyle: { fontSize: areaDimen(16), fontFamily: fonts.medium, color: ThemeManager.colors.textColor, },
    card: {
        flexDirection: "row", justifyContent: "space-between", paddingHorizontal: widthDimen(16), paddingVertical: heightDimen(16), 
        shadowColor: ThemeManager.colors.shadowColor,
        // shadowColor:'#0000000A',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.05,
        elevation: 4,
    },
    addTextStyle: { fontSize: areaDimen(14), fontFamily: fonts.medium, color: ThemeManager.colors.inActiveColor },
});
export default CurrencyCard;
