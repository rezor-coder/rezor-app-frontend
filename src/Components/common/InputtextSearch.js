import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Fonts, Colors, Images} from '../../theme';
import FastImage from 'react-native-fast-image';
import images from '../../theme/Images';
import {ThemeManager} from '../../../ThemeManager';
const InputtextSearch = props => {
  return (
    <View style={[styles.inputWrapStyle, props.style]}>
      {props.label ? (
        <Text style={[styles.labelTextStyle, props.labelStyle]}>
          {props.label}
        </Text>
      ) : null}
      {props.search && (
        <View style={styles.SearchImgStyle}>
          <FastImage
            style={{height: 20, width: 20}}
            resizeMode={'contain'}
            source={images.Search}
          />
        </View>
      )}
      <TextInput
        style={[styles.inputStyle, props.inputStyle]}
        placeholder={props.placeholder}
        onChangeText={props.onChangeNumber}
        placeholderTextColor={Colors.pink || props.placeholderTextColor}
        value={props.value}
        keyboardType={props.keyboardType}
        onBlur={props.onBlur}
        returnKeyType={props.returnKeyType}
        onSubmitEditing={props.onSubmitEditing}></TextInput>
      {props.clear && (
        <TouchableOpacity onPress={props.pressClear} style={styles.ImgStyle}>
          <FastImage
            style={{width: 15, height: 15}}
            tintColor={Colors.fadeDot}
            resizeMode={FastImage.resizeMode.contain}
            source={images.cancel}
          />
        </TouchableOpacity>
      )}
      <View style={props.rightStyle}>{props.children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapStyle: {
    alignSelf: 'center',
    backgroundColor: Colors.screenBg,
    borderRadius: 25,
    marginBottom: 20,
    position: 'relative',
    width: '90%',
    flexDirection: 'row',
  },
  labelTextStyle: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    // color: Colors.white,
    color: ThemeManager.colors.textColor,
    marginBottom: 10,
  },
  inputStyle: {
    height: 55,
    paddingLeft: 25,
    // color: Colors.white,
    color: ThemeManager.colors.textColor,
    fontFamily: Fonts.regular,
    fontSize: 16,
    width: '80%',
  },
  SearchImgStyle: {
    width: '10%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 20,
  },
  ImgStyle: {
    width: '10%',
    marginBottom: 5,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 15,
  },
});

export {InputtextSearch};
