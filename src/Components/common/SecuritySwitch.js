import React, { useState } from 'react';
import {
  View,
  Image,
  Switch,
  TouchableOpacity,
  TextInput,
  Text,
  StyleSheet,
} from 'react-native';
import { Fonts, Colors, Images } from '../../theme';
import SelectDropdown from 'react-native-select-dropdown';
import images from '../../theme/Images';
import { areaDimen, heightDimen, widthDimen } from '../../Utils/themeUtils';
import FastImage from 'react-native-fast-image';
import { ThemeManager } from '../../../ThemeManager';

const SecuritySwitch = props => {
  return (
    <View style={[styles.wrapStyle, props.style]} disabled={props.disabled}>
      <Text style={[styles.titleStyle, props.titleStyle]}>{props.title}</Text>
      {/* <Switch
        trackColor={{ false: Colors.fadetext, true: Colors.buttonColor2 }}
        thumbColor={props.isEnabled ? '#fff' : '#fff'}
        ios_backgroundColor={Colors.fadetext}
        onValueChange={props.toggleSwitch}
        value={props.isEnabled}
        style={{ transform: [{ scaleX: .6 }, { scaleY: .6 }] }}
      /> */}
            <TouchableOpacity
                  onPress={props.toggleSwitch}>
                  <FastImage
                    source={
                      props.isEnabled
                        ? Images.toggleOn
                        : ThemeManager.ImageIcons.toggleOff
                    }
                    style={{
                      height: heightDimen(18),
                      width: widthDimen(30),
                      marginRight: widthDimen(10),
                      paddingVertical: heightDimen(15),
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: heightDimen(60),
    alignItems: 'center',
    // borderBottomWidth: 0.4,
    // borderBottomColor: Colors.borderColor,
    paddingLeft: widthDimen(24),
    paddingRight: widthDimen(9)
  },
  titleStyle: {
    fontSize: areaDimen(14),
    fontFamily: Fonts.semibold,
    color: Colors.white,
  },
});

export { SecuritySwitch };
