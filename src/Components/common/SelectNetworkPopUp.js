import { View, Text, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native'
import React from 'react'
import { BlurView } from '@react-native-community/blur';
import { ThemeManager } from '../../../ThemeManager';
import { areaDimen, heightDimen, widthDimen } from '../../Utils/themeUtils';
import fonts from '../../theme/Fonts';
import images from '../../theme/Images';
import FastImage from 'react-native-fast-image';
const SelectNetworkPopUp = ({ onClose, onPressBnb, onPressEth, onPressStc }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
      <BlurView
        style={styles.blurView}
        blurType="dark"
        blurAmount={1}
        reducedTransparencyFallbackColor="white"
      />
      <>
        <View
          style={styles.centeredView}>
          <TouchableOpacity
            onPress={() => {
              onClose()
            }}
            style={[styles.centeredView1]}
          />

          <View
            style={{
              position: 'relative',
              minHeight: Platform.OS == 'ios' ? 260 : 270,
              backgroundColor: ThemeManager.colors.backgroundColor,
              width: '100%',
              borderTopLeftRadius: widthDimen(20),
              borderTopRightRadius: widthDimen(20),
            }}>
            <TouchableOpacity
              style={{
                padding: 5,
                alignSelf: 'flex-end',
                marginRight: widthDimen(28),
                marginTop: widthDimen(32),
                // backgroundColor: 'red',
              }}
              onPress={() => {
                onClose()
              }}>
              <Image
                source={images.cross}
                style={{
                  height: widthDimen(24),
                  width: widthDimen(24),
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: areaDimen(18),
                color: ThemeManager.colors.textColor,
                fontFamily: fonts.semibold,
                textAlign: 'center',
                marginHorizontal: heightDimen(70),
                marginTop: heightDimen(-28),
              }}>
              Select Network
            </Text>
            <View
              style={{
                marginTop: heightDimen(15),
                flexDirection: 'column',
                justifyContent: 'space-between',
                paddingHorizontal: widthDimen(20),
                paddingBottom: heightDimen(20),
              }}>
                  <TouchableOpacity
                disabled={true}
                key={'index'}
                onPress={() => onPressStc()}
                style={[
                  styles.networkBtnStyle,
                  {
                    borderBottomWidth: 0,
                    borderColor: ThemeManager.colors.viewBorderColor,
                    // backgroundColor:'red'
                  },
                ]}>
                <View
                  style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <FastImage
                    style={styles.imgstyle}
                    source={{ uri: "https://s2.coinmarketcap.com/static/img/coins/64x64/20513.png" }}
                    resizeMode="contain"
                  />
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.networkTextStyle,
                      {
                        color: ThemeManager.colors.textColor,
                      },
                    ]}>
                    {'SBC24(Coming Soon)'}
                  </Text>
                </View>
                {/* <FastImage
                  source={ThemeManager.ImageIcons.forwardArrowIcon}
                  style={[styles.arwImg]}
                  tintColor={ThemeManager.colors.lightTextColor}
                /> */}
              </TouchableOpacity>
              <TouchableOpacity
                key={'index'}
                onPress={() => onPressEth()}
                style={[
                  styles.networkBtnStyle,
                  {
                    borderBottomWidth: 0,
                    borderColor: ThemeManager.colors.viewBorderColor,
                  },
                ]}>
                <View
                  style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <FastImage
                    style={styles.imgstyle}
                    source={images.eth_with_shadow}
                    resizeMode="contain"
                  />
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.networkTextStyle,
                      { color: ThemeManager.colors.textColor },
                    ]}>
                    {'ETH'}
                  </Text>
                </View>
                <FastImage
                  source={ThemeManager.ImageIcons.forwardArrowIcon}
                  style={[styles.arwImg]}
                  tintColor={ThemeManager.colors.lightTextColor}
                />
              </TouchableOpacity>

              <TouchableOpacity
                key={'index'}
                onPress={() => onPressBnb()}
                style={[
                  styles.networkBtnStyle,
                  {
                    borderBottomWidth: 0,
                    borderColor: ThemeManager.colors.viewBorderColor,
                    // backgroundColor:'red'
                  },
                ]}>
                <View
                  style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <FastImage
                    style={styles.imgstyle}
                    source={images.bsc_with_shadow}
                    resizeMode="contain"
                  />
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.networkTextStyle,
                      {
                        color: ThemeManager.colors.textColor,
                      },
                    ]}>
                    {'BSC'}
                  </Text>
                </View>
                <FastImage
                  source={ThemeManager.ImageIcons.forwardArrowIcon}
                  style={[styles.arwImg]}
                  tintColor={ThemeManager.colors.lightTextColor}
                />
              </TouchableOpacity>

            
            </View>
          </View>
        </View>
      </>
    </View>
  )
}

export default SelectNetworkPopUp
const styles = StyleSheet.create({
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flex: 1,
  },
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  centeredView1: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  imgstyle: {
    alignSelf: 'center',
    height: heightDimen(40),
    width: widthDimen(40),
    borderRadius: 30
  },
  networkTextStyle: {
    lineHeight: areaDimen(19),
    marginLeft: widthDimen(12),
    fontSize: areaDimen(16),
    fontFamily: fonts.medium,
    textAlign: 'center',
  },
  networkBtnStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: heightDimen(20),
    alignItems: 'center',
    alignSelf: 'center',
    paddingLeft: widthDimen(15),
    justifyContent: 'space-between',
  },
  networkTextStyle: {
    lineHeight: areaDimen(19),
    marginLeft: widthDimen(12),
    fontSize: areaDimen(16),
    fontFamily: fonts.medium,
    textAlign: 'center',
  },
  arwImg: {
    height: areaDimen(10),
    width: areaDimen(10.6),
    resizeMode: 'contain',
    marginRight: 10
  },
})