import React from 'react';
import {TouchableOpacity, Image, View, Text, StyleSheet} from 'react-native';
import {color} from 'react-native-reanimated';
import {Fonts, Colors, Images} from '../../theme';
import colors from '../../theme/Colors';
import FastImage from 'react-native-fast-image';
import {ThemeManager} from '../../../ThemeManager';
import {areaDimen, heightDimen, widthDimen} from '../../Utils/themeUtils';
import images from '../../theme/Images';

const WalletItem = props => {
  //console.warn('MM','isDefault---', props.isDefault);
  return (
    <TouchableOpacity
      onPress={props.onPress}
      activeOpacity={0.7}
      style={[styles.wrapStyle, props.style]}>
      <View style={styles.wallet_iconStyle}>
        {props.imageUrl ? (
          <FastImage
            resizeMode="cover"
            style={[styles.currencyImage, {backgroundColor: props.imgbck}]}
            source={{uri: props.imageUrl}}
          />
        ) : props.showImg ? (
          <View
            style={[
              styles.imageViewStyle,
              {backgroundColor: ThemeManager.colors.primary},
            ]}>
            {/* <FastImage
                    style={styles.shadowImageStyle}
                    resizeMode={FastImage.resizeMode.contain}
                    source={images.viewWithShadow}
                  /> */}
            <FastImage
              style={styles.imgStyle}
              resizeMode={FastImage.resizeMode.contain}
              source={props.iconimg}
            />
          </View>
        ) : (
          <Image
            resizeMode="cover"
            style={[styles.currencyImage, {backgroundColor: props.imgbck}]}
            source={props.iconimg}
          />
        )}
      </View>
      <View style={styles.wallet_InfoStyle}>
        <Text
          style={[styles.titleStyle, {color: ThemeManager.colors.textColor}]}>
          {props.title}
        </Text>
      </View>

      <View style={styles.infoImage_style}>
        <Image
          style={{
            // tintColor: ThemeManager.colors.textColor,
            height: areaDimen(10),
            width: areaDimen(10.6),
            resizeMode: 'contain',
          }}
          source={ThemeManager.ImageIcons.forwardArrowIcon} //{Images.rightArrow}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: ThemeManager.colors.viewBorderColor,
  },
  wallet_iconStyle: {
    width: 38,
    height: 38,
    borderRadius: 50,
    backgroundColor: Colors.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wallet_InfoStyle: {
    flex: 1,
    paddingRight: 25,
    paddingLeft: widthDimen(12),
  },
  titleStyle: {
    fontFamily: Fonts.medium,
    fontSize: areaDimen(16),
    // color: Colors.White,
    color: ThemeManager.colors.textColor,
    marginBottom: 2,
  },
  subtitleStyle: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textStyle,
    lineHeight: 18,
  },
  infoImage_style: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  nameImage_style: {
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.warningTextStyle,
  },
  tokenImageText_style: {
    fontFamily: Fonts.semibold,
    fontSize: 16,
    // color: Colors.White,
    color: ThemeManager.colors.textColor,
  },
  currencyImage: {
    width: widthDimen(34),
    height: widthDimen(34),
    borderRadius: widthDimen(18),
    backgroundColor: colors.overlayer,
  },
  imageViewStyle: {
    borderRadius: 25,
    height: widthDimen(34),
    width: widthDimen(34),
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadowImageStyle: {
    height: widthDimen(38),
    width: widthDimen(38),
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgStyle: {
    width: widthDimen(16),
    height: widthDimen(16),
    position: 'absolute',
  },
});

export {WalletItem};
