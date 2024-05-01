import React from 'react';
import {TouchableOpacity, View, Image, Text, StyleSheet} from 'react-native';
import {Fonts, Colors, Images} from '../../theme';
import { areaDimen } from '../../Utils/themeUtils';

const ButtonTransaction = props => {
  return (
    <TouchableOpacity
      style={[
        styles.wrapStyle,
        props.style,
        props.isSelected ? [styles.isSelected, props.styleSelected] : null,
      ]}
      onPress={props.onPress}>
      <Text style={[styles.labelStyle,props.labelStyle]}>{props.label}</Text>
      <Text style={[styles.transactionfeeTextStyle,props.transactionfeeTextStyle]}>{props.transactionfee}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  wrapStyle: {
    flex: 1,
    //  backgroundColor: Colors.lightGrey2,
    // borderRightWidth: 0.4,
    // borderColor: '#fff',
    // paddingLeft: 16,
    paddingVertical: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelStyle: {
    fontSize: areaDimen(14),
    fontFamily: Fonts.semibold,
    color: Colors.white,
  },
  transactionfeeTextStyle: {
    fontSize: areaDimen(11),
    fontFamily: Fonts.semibold,
    color: Colors.white,
  },
  isSelected: {
    // backgroundColor: Colors.fadetext,
  },
});

export {ButtonTransaction};
