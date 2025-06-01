import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  TextInput
} from 'react-native';
import React from 'react';
import { BlurView } from '@react-native-community/blur';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';
import FastImage from 'react-native-fast-image';
import images from '../../../theme/Images';
import fonts from '../../../theme/Fonts';
import { BasicButton } from '../../common';
import { Colors } from '../../../theme';

const ListModal = ({
  list,
  onClose,
  onPressItem,
  isEpay,
  isSearch,
  changeText,
  searchText,
  onScroll,
  isAddCustom,
  onPressAddCustomToken,
  title='Asset',
  listFooterComponent,
  onEndReached,
  onEndReachedThreshold

}) => {
  return (
    <View style={{flex: 1, justifyContent: 'flex-end'}}>
      <BlurView
        style={styles.blurView}
        blurType={ThemeManager.colors.themeColor === 'dark' ? 'dark' : 'light'}
        blurAmount={1}
        reducedTransparencyFallbackColor="white"
      />
      <>
        <View style={[styles.centeredView]}>
          <TouchableOpacity onPress={onClose} style={[styles.centeredView1]} />
          <View
            style={[
              styles.mainView,
              {backgroundColor: ThemeManager.colors.backgroundColor},
            ]}>
            <TouchableOpacity style={styles.imageTouchable} onPress={onClose}>
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
                color: ThemeManager.colors.headingText,
                fontFamily: fonts.semibold,
                textAlign: 'center',
                marginHorizontal: heightDimen(70),
                marginTop: heightDimen(-28),
                paddingBottom: heightDimen(12),
              }}>
              {`Select ${title}`}
            </Text>
            {isSearch && (
              <View style={styles.textInputOuter}>
                <View
                  style={[
                    styles.textInputView,
                    {backgroundColor: ThemeManager.colors.bg},
                  ]}>
                  <TextInput
                    maxLength={85}
                    placeholder="Search "
                    placeholderTextColor={ThemeManager.colors.lightTextColor}
                    style={{
                      fontSize: areaDimen(14),
                      fontFamily: fonts.medium,
                      flexGrow: 1,
                      color: ThemeManager.colors.textColor,
                    }}
                    onChangeText={changeText}
                    searchText={searchText}
                  />
                  <FastImage
                    source={images.searchIconDark}
                    style={{height: areaDimen(18), width: areaDimen(18)}}
                    resizeMode="contain"
                  />
                </View>
              </View>
            )}
            <FlatList
              data={list}
              showsVerticalScrollIndicator={false}
              style={{marginBottom: heightDimen(40)}}
              onScroll={onScroll}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    key={'index'}
                    onPress={() => {
                      onClose();
                      onPressItem(item, index);
                    }}
                    style={[
                      styles.networkBtnStyle,
                      {
                        borderBottomWidth: 1,
                        borderColor: ThemeManager.colors.tabBorder,
                      },
                    ]}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      {item?.coin_image || item?.iconUrl  ? (
                        <FastImage
                          style={styles.imgstyle}
                          source={
                            typeof item?.coin_image == 'string'|| typeof item?.iconUrl == 'string' 
                              ? {uri: item?.coin_image ||item?.iconUrl}
                              : item?.coin_image
                          }
                          resizeMode="contain"
                        />
                      ) : (
                        <View
                          style={{
                            borderRadius: widthDimen(20),
                            width: widthDimen(36),
                            height: widthDimen(36),
                            backgroundColor: ThemeManager.colors.primary,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              fontFamily: fonts.semibold,
                              fontSize: areaDimen(15),
                              lineHeight: heightDimen(18),
                            }}>
                               {item?.coin_name?.charAt(0) || item?.currency?.charAt(0)}
                          </Text>
                        </View>
                      )}
                      <Text
                        allowFontScaling={false}
                        style={[
                          styles.networkTextStyle,
                          {color: ThemeManager.colors.textColor},
                        ]}>
                        {isEpay
                          ? item?.coin_symbol?.toUpperCase()
                          : item?.currency ? item.currency+ (item.baseCurrency?' ('+item.baseCurrency+') ':'') :item?.coin_name?.toUpperCase()}
                      </Text>
                      {item?.is_token == 1 && (
                        <Text
                          allowFontScaling={false}
                          style={[
                            styles.networkTextStyle,
                            {
                              color: ThemeManager.colors.inActiveColor,
                              fontSize: areaDimen(13),
                            },
                          ]}>
                          {item?.coin_family == 6
                            ? '(BNB)'
                            //: item?.coin_family == 4
                            //? '(SBC)' //Commented for coming soon
                            : '(ETH)'}
                        </Text>
                      )}
                    </View>
                    <FastImage
                      source={ThemeManager.ImageIcons.forwardArrowIcon}
                      style={[styles.arwImg]}
                      tintColor={ThemeManager.colors.lightTextColor}
                      resizeMode='contain'
                    />
                  </TouchableOpacity>
                );
              }}
              ListFooterComponent={listFooterComponent}
              ListEmptyComponent={() => {
                if (isAddCustom) {
                  return (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: heightDimen(30),
                      }}>
                      <Text
                        style={[
                          styles.noAssetText,
                          {color: ThemeManager.colors.textColor},
                        ]}>
                        {LanguageManager.assetsNotFound}
                      </Text>
                      <BasicButton
                        onPress={onPressAddCustomToken}
                        btnStyle={styles.btnStyle}
                        customGradient={styles.customGrad}
                        text={LanguageManager.addCustomToken}
                      />
                    </View>
                  );
                } else {
                  return null;
                }
              }}
              onEndReached={onEndReached}
              onEndReachedThreshold={onEndReachedThreshold}
            />
          </View>
        </View>
      </>
    </View>
  );
};

export default ListModal;
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
    backgroundColor: 'rgba(0, 0, 0, .5)',
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
    height: heightDimen(36),
    width: widthDimen(36),
    borderRadius: 30,
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
    marginRight: widthDimen(30),
  },
  mainView: {
    position: 'relative',
    minHeight: heightDimen(150),
    height: Platform.OS == 'ios' ? heightDimen(760) : heightDimen(770),
    width: '100%',
    borderTopLeftRadius: widthDimen(20),
    borderTopRightRadius: widthDimen(20),
  },
  imageTouchable: {
    padding: 5,
    alignSelf: 'flex-end',
    marginRight: widthDimen(28),
    marginTop: widthDimen(22),
    // backgroundColor: 'red',
  },
  textInputView: {
    borderWidth: 1,
    borderColor: ThemeManager.colors.viewBorderColor,
    flexDirection: 'row',
    paddingHorizontal: widthDimen(22),
    borderRadius: areaDimen(25),
    height: heightDimen(45),
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center'
  },
  textInputOuter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: widthDimen(24),
    paddingBottom: heightDimen(12),
    paddingTop: heightDimen(12)
  },
  btnStyle: {
    width: '86%',
    height: heightDimen(60),
    marginHorizontal: widthDimen(30),
    marginVertical:heightDimen(20)
  },
  customGrad: {
  },
  noAssetText:{
    fontFamily: fonts.medium,
    fontSize: areaDimen(18),
    color: Colors.textColor,
    textAlign: 'left',
    lineHeight: heightDimen(22),
  }
});
