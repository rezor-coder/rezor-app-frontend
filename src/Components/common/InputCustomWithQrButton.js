import React, {useEffect, useState} from 'react';
import {
  TextInput,
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {EventRegister} from 'react-native-event-listeners';
import {ThemeManager} from '../../../ThemeManager';
import {Fonts, Images} from '../../theme';
import {areaDimen, heightDimen, widthDimen} from '../../Utils/themeUtils';
const InputCustomWithQrButton = props => {
  const [themeSelected, setThemeSelected] = useState(2);

  //******************************************************************************************/
  return (
    <>
      <View>
        {props.label ? (
          <Text
            style={[
              styles.textStyle1,
              {color: ThemeManager.colors.textColor, marginBottom: 3},
            ]}>
            {props.label}
          </Text>
        ) : null}
        <TouchableOpacity
          disabled={props.disabled}
          activeOpacity={0.9}
          onPress={props.onPress}
          style={[
            styles.ViewStyle,
            props.outsideView,
            {borderColor: ThemeManager.colors.borderColor},
          ]}>
          {props.bank ? (
            <>
              <Image style={styles.imgStyle} source={props?.item?.img} />
              <TextInput
                numberOfLines={props.numberOfLines}
                onFocus={props.onFocus}
                secureTextEntry={props.secureTextEntry}
                value={props.value}
                placeholder={props.placeHolder}
                onChangeText={props.onChangeText}
                style={[
                  styles.inputStyle1,
                  props.customInputStyle,
                  {color: ThemeManager.colors.textColor},
                ]}
                autoCorrect={false}
                keyboardType={props.keyboardType}
                editable={props.editable}
                maxLength={props.maxLength}
                placeholderTextColor={props.placeholderTextColor}
              />
              <View style={[styles.ViewStyle11]}>
                <TouchableOpacity
                  disabled={props.disabled}
                  style={[{marginRight: 15}, props.qrstyle]}
                  onPress={props.showQrCode}>
                  <Image
                    source={props.notScan ? props.image : Images.scan}
                    style={{
                      transform: [{rotate: props.toggle ? '180deg' : '0deg'}],
                      tintColor: ThemeManager.colors.iconColor,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              {props.children}
              <TextInput
                numberOfLines={props.numberOfLines}
                onFocus={props.onFocus}
                secureTextEntry={props.secureTextEntry}
                value={props.value}
                placeholder={props.placeHolder}
                onChangeText={props.onChangeText}
                style={[
                  styles.inputStyle,
                  props.customInputStyle,
                  {color: ThemeManager.colors.textColor},
                ]}
                autoCorrect={false}
                keyboardType={props.keyboardType}
                editable={props.editable}
                maxLength={props.maxLength}
                placeholderTextColor={props.placeholderTextColor}
              />
              <View style={[styles.ViewStyle1, props.customBtnsView]}>
                {props.isPaste == true ? (
                  <TouchableOpacity
                    disabled={props.disablePaste}
                    style={{alignSelf: 'center', paddingVertical: 5}}
                    onPress={props.onPressPaste}>
                    <Text
                      style={[
                        styles.textStyle,
                        {color: ThemeManager.colors.textColor},
                      ]}>
                      {props.paste}
                    </Text>
                  </TouchableOpacity>
                ) : null}

                {props.customIcon && (
                  <TouchableOpacity
                    style={[{marginRight: 15}, props.copystyle]}
                    onPress={async () => {
                      props.customIconPress();
                    }}>
                    <Image
                      source={props.customIcon}
                      style={{tintColor: ThemeManager.colors.iconColor}}
                    />
                  </TouchableOpacity>
                )}

                {props.isCopy == true ? (
                  <TouchableOpacity
                    style={[{marginRight: 15}, props.copystyle]}
                    onPress={async () => {
                      props.doCopy();
                    }}>
                    <Image
                      source={Images.IconCopyInside}
                      style={{tintColor: ThemeManager.colors.iconColor}}
                    />
                  </TouchableOpacity>
                ) : null}

                {!props.hideQR && (
                  <TouchableOpacity
                    disabled={props.disabled}
                    style={[{marginRight: 15}, props.qrstyle]}
                    onPress={async () => {
                      props.showQrCode();
                    }}>
                    <Image
                      source={props.notScan ? props.image : Images.scan}
                      style={{
                        tintColor: ThemeManager.colors.iconColor,
                        marginVertical: heightDimen(10),
                        marginLeft: heightDimen(10),
                      }}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
};

//******************************************************************************************/
const styles = StyleSheet.create({
  imgStyle: {
    alignSelf: 'center',
    marginLeft: areaDimen(18),
  },
  ViewStyle1: {
    width: '25%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  ViewStyle: {
    flexDirection: 'row',
    width: '100%',
    borderWidth: 1,
    overflow: 'hidden',
    borderRadius: 10,
    paddingRight: 10,
    height: areaDimen(55),
  },
  textStyle1: {
    fontSize: areaDimen(14),
    fontFamily: Fonts.regular,
    marginTop: heightDimen(10),
  },
  textStyle: {
    alignSelf: 'center',
    fontSize: 12,
    marginRight: 12,
    fontFamily: Fonts.medium,
  },
  inputStyle: {
    paddingHorizontal: 22,
    fontSize: 14,
    height: 55,
    borderRadius: 10,
    fontFamily: Fonts.regular,
    width: '75%',
  },
  inputStyle1: {
    paddingHorizontal: widthDimen(10),
    fontSize: areaDimen(14),
    height: heightDimen(55),
    borderRadius: areaDimen(10),
    fontFamily: Fonts.regular,
    width: '70%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  ViewStyle11: {
    width: '15%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
export {InputCustomWithQrButton};
