/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import { ThemeManager } from '../../../ThemeManager';
import { Fonts, Images } from '../../theme';
import Colors from '../../theme/Colors';
import { heightDimen } from '../../Utils/themeUtils';

const BasicInputBoxSelect = props => {
  return (
    <View style={[{ paddingHorizontal: 10, justifyContent: 'center', }, props.mainContainerStyle,]}>
      <Text
        style={[{ color: ThemeManager.colors.textColor, left: 0, marginTop: 10 }, props.titleStyle,]}>
        {props.title}
      </Text>

      <View style={[styles.input, props.mainStyle]}>
        <TouchableOpacity
          disabled={props.disabled}
          onPress={props.pressPhone}
          style={{ flexDirection: 'row' }}>
          <Text onPress={props.press} style={[{ color: ThemeManager.colors.textColor, textAlign: 'center', }, props.coinStyle]}>
            {props.countrycode}
          </Text>
          <Image
            source={Images.arrowBack}
            style={[{
              height: 8, width: 8, resizeMode: 'contain', transform: [{ rotate: '270deg' }], alignSelf: 'center',
              marginLeft: 10,tintColor:ThemeManager.colors.textColor
            },props.arrowStyle]}
          />
        </TouchableOpacity>

        <View style={{ height: 27, backgroundColor: Colors.borderColorLang, width: 1, marginHorizontal: 10 }} />
        <TextInput
          style={[
            { width: props.width, color: ThemeManager.colors.textColor },
            props.style,
          ]}
          onChangeText={text => props?.onChangeText(text)}
          value={props.text}
          placeholder={props.placeholder}
          placeholderTextColor={Colors.languageItem}
          secureTextEntry={props.secureTextEntry}
          editable={props.editable}
          keyboardType={props.keyboardType}
          ref={props.ref}
          maxLength={props.maxLength}
        />
        {
          props?.right ?
          props?.right :
          null
        }

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    // borderColor: Colors.languageItem,
    flexDirection: 'row',
    borderWidth: 1,
    height: heightDimen(50),
    marginTop: 10,
    fontSize: 16,
    paddingLeft: 20,
    borderRadius: 10, alignItems: 'center'
    // backgroundColor: Colors.inputDarkbg,
  },
});

export { BasicInputBoxSelect };
