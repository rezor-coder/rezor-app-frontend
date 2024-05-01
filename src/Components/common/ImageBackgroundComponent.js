import React from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Image,
  Text,
  ImageBackground,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ThemeManager} from '../../../ThemeManager';
import {Images} from '../../theme';
import Colors from '../../theme/Colors';
import fonts from '../../theme/Fonts';

const ImageBackgroundComponent = props => {
  return (
    <ImageBackground
      resizeMode="stretch"
      style={props.style}
      source={ThemeManager.ImageIcons.backgroundImage}>
      {props.children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  input: {
    borderColor: Colors.languageItem,
    borderWidth: 2,
    height: 50,
    marginTop: 30,
    fontSize: 16,
    paddingLeft: 20,
    borderRadius: 4,
    // color: Colors.white,
    color: ThemeManager.colors.textColor,
  },
});

export {ImageBackgroundComponent};
