import React from "react"
import { areaDimen, heightDimen, widthDimen } from "../../Utils/themeUtils"
import { LanguageManager, ThemeManager } from "../../../ThemeManager"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import FastImage from "react-native-fast-image"
import { BASE_IMAGE } from "../../Endpoints"
import { Colors } from "../../theme"
import fonts from "../../theme/Fonts"
import Singleton from "../../Singleton"
import { CommaSeprator3 } from "../../utils"

const Card = (props) => {
  return (
    props.isSaitaDex ?
      <View style={[styles.ViewStyle, { backgroundColor: ThemeManager.colors.iconBg }]}>
        {props.item?.coin_image ? (
          <FastImage source={{ uri: props.item?.coin_image.includes('https') ? props.item?.coin_image : BASE_IMAGE + props.item?.coin_image }} style={styles.imgstyle} />
        ) : (
          <View style={styles.ViewStyle1}>
            <Text style={styles.textStyle3}>{props.item?.coin_name.charAt(0)}</Text>
          </View>
        )}

        <View style={{ marginLeft: widthDimen(12), flex: 1 }}>
          <Text style={[{ color: ThemeManager.colors.textColor }, styles.textStyle]}>{props.item?.coin_name?.toUpperCase() + ' (' + props.item?.coin_symbol?.toUpperCase() + ')'}</Text>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={()=>props.onPressSwap(props.item)} style={[styles.touchableStyle, { backgroundColor: ThemeManager.colors.primary }]}>
            <Text style={[{ color: Colors.white }, styles.textStyle2]}>{LanguageManager.swap}</Text>
          </TouchableOpacity>
        </View>
      </View>
      :
      <View style={[styles.ViewStyle, { backgroundColor: ThemeManager.colors.iconBg }]}>
        <View style={styles.ViewStyle1}>
          <Text style={styles.textStyle3}>{props.item?.receivingCurrency.charAt(0)}</Text>
        </View>
        <View style={{ marginLeft: widthDimen(12), flex: 1 }}>
          <Text style={[{ color: ThemeManager.colors.textColor }, styles.textStyle]}>{props.item?.receivingCurrency?.toUpperCase() + '/' + props.item?.receivableCurrency?.toUpperCase()}</Text>
          <Text style={[{ color: ThemeManager.colors.inActiveColor }, styles.textStyle1]} numberOfLines={1}>
            ${props.item?.price >= 0.01 ? CommaSeprator3(props.item?.price, 2) : CommaSeprator3(Singleton.getInstance().exponentialToDecimal(props.item?.price), 8)}
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={props.onPressBuy} style={[styles.touchableStyle, { backgroundColor: ThemeManager.colors.primary }]}>
            <Text style={[{ color: Colors.white }, styles.textStyle2]}>{LanguageManager.buySell}</Text>
          </TouchableOpacity>
        </View>
      </View>
  )
}

const styles = StyleSheet.create({
  textStyle2: {
    fontFamily: fonts.medium,
    fontSize: areaDimen(12),
    lineHeight: areaDimen(15)
  },
  touchableStyle: {
  //  height: heightDimen(26),
    minWidth: widthDimen(57),
    borderRadius: 100,
    paddingHorizontal: widthDimen(16),
    paddingVertical: heightDimen(9),
    justifyContent:'center',
    alignItems:'center',
    // borderWidth: areaDimen(0.8),
  },
  ViewStyle: {
    minHeight: heightDimen(70),
    borderRadius: areaDimen(12),
    backgroundColor: 'red',
    marginBottom: heightDimen(10),
    paddingHorizontal: widthDimen(16),
    paddingVertical: heightDimen(16),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor:ThemeManager.colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.05,
    elevation: 4,
    marginHorizontal:widthDimen(5)
  },
  imgstyle: {
    height: areaDimen(38),
    width: areaDimen(38),
    borderRadius: areaDimen(15),
  },
  ViewStyle1: {
    height: areaDimen(38),
    width: areaDimen(38),
    backgroundColor: Colors.buttonColor2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: areaDimen(40),
  },
  textStyle: {
    fontFamily: fonts.medium,
    fontSize: areaDimen(15),
    lineHeight: areaDimen(19),
    marginBottom: heightDimen(4),
  },
  textStyle1: {
    fontFamily: fonts.medium,
    fontSize: areaDimen(14),
    lineHeight: areaDimen(18),
    width:'100%'
  },
  textStyle3: {
    fontFamily: fonts.medium,
    fontSize: areaDimen(14),
    lineHeight: areaDimen(18),
    textTransform: 'capitalize',
    color: Colors.White
  }
})
export { Card }