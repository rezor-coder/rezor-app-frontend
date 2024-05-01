import React, {useState} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ThemeManager} from '../../../ThemeManager';
import {Fonts, Colors, Images} from '../../theme';
import ToggleSwitch from 'toggle-switch-react-native';
const ToggleButton = props => {
  const [onToggle, setOnToggle] = useState(false);
  return (
    <ToggleSwitch
      isOn={props.isOn}
      onColor={Colors.toggleColor}
      offColor={ThemeManager.colors.toggleColor}
      // label="Example label"
      // labelStyle={{color: 'black', fontWeight: '200'}}
      size="small"
      // onToggle={isOn => setOnToggle(isOn)}
      onToggle={props.onChange}
    />
  );
};

const styles = StyleSheet.create({
  viewMainContainer: {
    marginTop: 15,
    alignSelf: 'stretch',
    justifyContent: 'center',
    height: 40,
    alignItems: 'center',
  },
  titleText: {
    marginTop: 2.5,
    textAlign: 'center',
    fontSize: 11,
    marginLeft: 2.5,
    textTransform: 'capitalize',
  },
});

export {ToggleButton};
