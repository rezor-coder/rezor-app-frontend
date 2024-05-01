import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Text,
  StyleSheet,
} from 'react-native';
import { Fonts, Colors, Images } from '../../theme';
import SelectDropdown from 'react-native-select-dropdown';
import images from '../../theme/Images';
import FastImage from 'react-native-fast-image';
import { ThemeManager } from '../../../ThemeManager';
import { areaDimen, heightDimen, widthDimen } from '../../Utils/themeUtils';

const SecurityLink = props => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.wrapStyle, props.style]}>
      <Text style={[styles.titleStyle, props.textstyle]}>{props.title}</Text>
      {props.showIcon ? (
        <Image
          style={{ height: widthDimen(10.5), width: widthDimen(6.5), resizeMode: 'contain' }}
          source={ThemeManager.ImageIcons.forwardArrowIcon}></Image>
      ) : null}
    </TouchableOpacity>
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
    paddingHorizontal: widthDimen(24),
  },
  titleStyle: {
    fontSize: areaDimen(14),
    fontFamily: Fonts.semibold,
    color: Colors.white,
  },
});

export { SecurityLink };
