import React from 'react';
import {
  TouchableOpacity,
  Image,
  View,
  Text,
  StyleSheet,
  Switch,
} from 'react-native';
import {ThemeManager} from '../../../ThemeManager';
import {Fonts, Colors, Images} from '../../theme';
import colors from '../../theme/Colors';
import images from '../../theme/Images';
import {areaDimen, heightDimen, widthDimen} from '../../Utils/themeUtils';
import FastImage from 'react-native-fast-image';

const SettingBar = props => {
  console.log('iconImage===', props.iconImage);
  return (
    <TouchableOpacity
      disabled={props.disabled}
      onPress={props.onPress}
      style={[styles.accountItemWrap, props.style]}>
      {props.iconImage ? props.shadowImage ? (
        <View style={[styles.iconImageStyle, props.iconImageStyle]}>
          <FastImage
            source={images.viewWithShadow}
            style={styles.shadowImageStyle}
          />
          <FastImage
            style={[props.imgStyle, {position: 'absolute'}]}
            source={props.iconImage}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
      ) : (
        <View style={[styles.iconImageStyle, props.iconImageStyle]}>
          <FastImage
            style={props.imgStyle}
            source={props.iconImage}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
      ) : 
      null}
      <View style={styles.titleWrap}>
        <Text style={[styles.titleWrapStyle, props.titleStyle]}>
          {props.title}
        </Text>
        {props.isseconText && (
          <Text style={[styles.titlesecond]}>{props.seconText}</Text>
        )}
      </View>
      {props.isLogin ? (
        <Switch
          style={styles.toglestyle}
          ios_backgroundColor={Colors.createWalletPlaceholderColor}
          onValueChange={props.toggleSwitch}
          value={props.isEnabled}
          trackColor={{
            false: Colors.createWalletPlaceholderColor,
            true: Colors.primaryColor,
          }}
          thumbColor={props.isEnabled ? '#fff' : '#fff'}
        />
      ) : (
        <View>
          {props.showArw == false ? (
            <>
              {props.showRightImage == false ? (
                <Text></Text>
              ) : (
                <FastImage source={props.rightImage} style={styles.rightImg}  resizeMode={FastImage.resizeMode.contain} />
              )}
            </>
          ) : (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {props.isDetailIcon && (
                <FastImage
                  source={props.detailIcon}
                  style={[styles.detailImg]}
                  resizeMode={FastImage.resizeMode.contain}
                />
              )}
              {props.isDetailText && (
                <Text
                  style={[
                    styles.titleDetailStyle,
                    {color: ThemeManager.colors.lightTextColor},
                  ]}>
                  {props.detailText}
                </Text>
              )}
              <FastImage
                source={props.arrowIcon}
                style={[
                  styles.arwImg,
                ]}
                tintColor={ThemeManager.colors.lightTextColor}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
          )}
          {/* {props.showRightImage == false ? (
            <Text></Text>
          ) : (
            <Image source={props.rightImage} style={styles.rightImg} />
          )} */}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  accountItemWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: widthDimen(14),
    // borderBottomColor: Colors.borderBottomAccount,
    paddingHorizontal: widthDimen(10),
  },
  iconImageStyle: {
    width: 50,
    height: 30,
    // paddingLeft: 10,
    justifyContent: 'center',
  },
  shadowImageStyle: {
    height: widthDimen(38),
    width: widthDimen(38),
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  arwImg: {
    height: areaDimen(10),
    width: areaDimen(10.6),
    resizeMode: 'contain',
  },
  rightImg: {
    height: 30,
    width: 60,
    // tintColor: colors.white,
    resizeMode: 'contain',
    alignSelf: 'flex-end',
  },
  titleWrapStyle: {
    fontFamily: Fonts.medium,
    fontSize: areaDimen(14),
    color: Colors.white,
  },

  titlesecond: {
    fontFamily: Fonts.regular,
    fontSize: areaDimen(10),
    color: '#6E737E',
  },
  titleDetailStyle: {
    fontFamily: Fonts.medium,
    fontSize: areaDimen(12),
    marginRight: widthDimen(8),
  },
  detailImg: {
    height: areaDimen(20),
    width: areaDimen(20),
    resizeMode: 'contain',
    marginRight: widthDimen(5),
  },
  toglestyle: {},
});

export {SettingBar};
