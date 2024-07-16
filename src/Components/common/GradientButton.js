import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Colors, Fonts} from '../../theme';
import {areaDimen, widthDimen} from '../../Utils/themeUtils';
import LinearGradient from 'react-native-linear-gradient';

const GradientButton = ({
  buttonStyle,
  children,
  buttonColor = [],
  onPress = () => {},
  disabled,
  title,
}) => {
  return (
    <LinearGradient
      colors={
        buttonColor.length > 0
          ? buttonColor
          : [Colors.buttonColor1, Colors.buttonColor1]
      }
      start={{x: 0, y: 0}}
      style={{...styles.gradentButton, ...buttonStyle}}
      end={{x: 1, y: 0}}>
      <TouchableOpacity
        disabled={disabled}
        hitSlop={{bottom: 10, top: 10, left: 10, right: 10}}
        onPress={onPress}>
        {title ? <Text style={styles.buttonText}>{title}</Text> : children}
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default React.memo(GradientButton);

const styles = StyleSheet.create({
  gradentButton: {
    width: widthDimen(178),
    borderRadius: areaDimen(17),
    justifyContent: 'center',
    padding: areaDimen(10),
  },
  buttonText: {
    textAlign: 'center',
    color: Colors.white,
    fontSize: areaDimen(17),
    fontFamily: Fonts.semibold,
  },
});
