import React from 'react';
import { Text, View, Image, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Fonts, Colors, Images } from '../../theme';
import FastImage from 'react-native-fast-image';
const PinBtns = (props) => {
  const { textStyle, imgStyle } = styles
  return (

    <TouchableWithoutFeedback style={{ borderWidth: 2, }} onPress={props.onPress}>
      <View style={[styles.pinBtnStyle]}>

        {props.Numbers != undefined && <Text style={[textStyle, props.hideText]}>{props.Numbers}</Text>}
        <FastImage style={[imgStyle, props.imgStyle]} tintColor={props.tintColor} resizeMode={'contain'} source={{ uri: props.thumbImage }} />

      </View>
    </TouchableWithoutFeedback>

  );
};

const styles = StyleSheet.create({
  pinBtnStyle: {
    position: 'relative',
    width: '33%',
    height: '35%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    color: Colors.pinTextColor,
    fontSize: 22,
    fontFamily: Fonts.bold,
  },
  imgStyle: {
    height: 25,
    width: 25,
    // marginBottom: 20
  }
});

export { PinBtns };
