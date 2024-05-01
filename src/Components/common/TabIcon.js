import React from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { ThemeManager } from '../../../ThemeManager';
import { Fonts, Colors, Images } from '../../theme';
import fonts from '../../theme/Fonts';
import { areaDimen, heightDimen, widthDimen } from '../../Utils/themeUtils';

const TabIcon = props => {
  return (
    <View style={[styles.viewMainContainer, props.style]}>
      {/* {props.focused ?  */}
      <View>
        <View style={{ alignItems: 'center' }}>
          <FastImage
            source={props.focused ? props.activeImg : props.defaultImg}
            style={[{height:heightDimen(20),width:widthDimen(17)}, props.ImgSize]}
            resizeMode='contain'
            tintColor={props.tintColor}
          />
          <Text
            style={[
              styles.titleText,
              {
                color: props.tintColor
              },
            ]}>
            {props.title}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewMainContainer: {
    marginTop: 10,
    // paddingBottom: 7,
    alignSelf: 'stretch',
    justifyContent: 'center',
    height: 45,
    alignItems: 'center',
    alignContent: 'center',
  },
  titleText: {
    marginTop: 2.5,
    textAlign: 'center',
    fontSize: areaDimen(12),
    lineHeight: 15,
    fontFamily: fonts.semibold,
    alignSelf: 'center',
    color: ThemeManager.colors.primary
  },
});

export { TabIcon };
