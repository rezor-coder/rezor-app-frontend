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

import { Fonts, Images, Colors } from '../../theme';
import { areaDimen, heightDimen, widthDimen } from '../../Utils/themeUtils';

const BasicInputBoxPassword = props => {

  return (
    <View
      style={[{ paddingHorizontal: 10, justifyContent: 'center' }, props.mainContainerStyle,]}>
      <View style={[props.txtViewStyle, { alignSelf: 'flex-start' }]}>
        <Text
          style={[
            { color: ThemeManager.colors.textColor, left: 0, marginTop: 10 },
            props.titleStyle,
          ]}>
          {props.title}
        </Text>
      </View>
      <View style={[styles.input, props.mainStyle]}>
        <TextInput
          style={[{ width: props.width, color: ThemeManager.colors.textColor,fontSize:areaDimen(14),lineHeight:heightDimen(18),fontFamily:Fonts.medium }, props.style,]}
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
        <View style={{ alignSelf: 'center', marginLeft: 4 }}>
          <TouchableOpacity onPress={props.onPress}>
            {props.secureTextEntry ?
              <Image style={{ tintColor: 'grey',height: widthDimen(20), width: widthDimen(20), resizeMode: 'contain' }} source={!props.secureTextEntry ? Images.open_eye : Images.eye_card} />
              :
              <Image style={{ tintColor: 'grey', height: widthDimen(20), width: widthDimen(20), resizeMode: 'contain' }} source={!props.secureTextEntry ? Images.open_eye : Images.eye_card} />
            }
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    // borderColor: Colors.languageItem,
    flexDirection: 'row',
    borderWidth: 1,
    height:heightDimen( 50),
    marginTop: heightDimen(10),
    fontSize: areaDimen(14),
    paddingLeft: widthDimen(24),
    borderRadius: 100,
    // backgroundColor: Colors.inputDarkbg,
  },
});

export { BasicInputBoxPassword };
