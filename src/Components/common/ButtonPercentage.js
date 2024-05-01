import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {Fonts, Colors, Images} from '../../theme';

const ButtonPercentage = props => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.btnStyle, props.customStyle]}>
      <Text style={[styles.btnTextStyle, props.textstyle]}>{props.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnStyle: {
    backgroundColor: Colors.buttonPercentageBg,
    height: 41,
    borderRadius: 28,
    borderColor: Colors.buttonPercentageBg,
    color: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    maxWidth: '23%',
  },
  btnTextStyle: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.white,
  },
});

export {ButtonPercentage};
