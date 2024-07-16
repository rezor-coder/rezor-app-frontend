import React, {useState} from 'react';
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ThemeManager} from '../../../ThemeManager';
import {areaDimen, height, heightDimen, width} from '../../Utils/themeUtils';
import {Fonts, Images} from '../../theme';

const CustomDropDown = ({
  lable,
  onSelectValue = value => {},
  selectedValue = {},
  data = [],
  leftIcon,
  onPressLeftIcon = () => {},
  labelStyle,
  leftIconStyle,
  rightIconStyle,
  rightIcon = Images.dropIconDownLight,
  onPressRightIcon = () => {},
  tintColor = ThemeManager.colors.inActiveColor,
  placeholder,
  mainContainerStyle
}) => {
  const [showModal, setShowModal] = useState(false);
  const onPressShowModal = () => {
    if (data.length <= 0) {
      Alert.alert('Add data first');
      return;
    }
    setShowModal(!showModal);
  };
  const onPressCloseModal = item => {
    setShowModal(false);
    onSelectValue(item);
  };
  return (
    <View style={mainContainerStyle}>
      <Text
        style={[
          styles.labelStyle,
          {color: ThemeManager.colors.textColor},
          labelStyle,
        ]}>
        {lable}
      </Text>
      <TouchableOpacity
        style={styles.inputStyle}
        activeOpacity={0.9}
        onPress={onPressShowModal}>
        {!!leftIcon ? (
          <View style={styles.iconViewStyle}>
            <TouchableOpacity onPress={onPressLeftIcon}>
              <FastImage
                source={leftIcon}
                style={[styles.iconStyle, leftIconStyle]}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        ) : null}
        <View style={styles.inputTextStyle}>
          <Text
            style={[
              styles.textStyle,
              {
                color: !!selectedValue.title
                  ? ThemeManager.colors.textColor
                  : ThemeManager.colors.lightTextColor,
              },
            ]}>
            {!!selectedValue?.title
              ? selectedValue?.title || value
              : placeholder}
          </Text>
        </View>

        {rightIcon ? (
          <View style={[styles.iconViewStyle, {marginRight: areaDimen(16)}]}>
            <TouchableOpacity onPress={onPressRightIcon}>
              <FastImage
                source={rightIcon}
                style={[styles.iconStyle, rightIconStyle]}
                resizeMode="contain"
                tintColor={tintColor}
              />
            </TouchableOpacity>
          </View>
        ) : null}
      </TouchableOpacity>
      {!!showModal && data.length > 0 ? (
        <FlatList
          data={data}
          bounces={false}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          style={{
            backgroundColor: ThemeManager.colors.backgroundColor,
            borderColor: ThemeManager.colors.lightTextColor,
            ...styles.modalStyle
          }}
          contentContainerStyle={{overflow: 'hidden'}}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                style={{
                  padding: areaDimen(8),
                  justifyContent: 'center',
                }}
                onPress={() => onPressCloseModal(item)}>
                <Text
                  style={[
                    styles.textStyle,
                    {color: ThemeManager.colors.textColor},
                  ]}>
                  {item?.title || value}
                </Text>
              </TouchableOpacity>
            );
          }}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 1,
                backgroundColor: ThemeManager.colors.lightTextColor,
                width: '100%',
              }}
            />
          )}
        />
      ) : 
      null}
    </View>
  );
};

export default CustomDropDown;

const styles = StyleSheet.create({
  labelStyle: {
    fontFamily: Fonts.medium,
    fontSize: areaDimen(14),
    zIndex: 0,

    marginBottom: areaDimen(10),
    lineHeight: heightDimen(18),
  },
  inputStyle: {
    height: heightDimen(50),
    borderRadius: heightDimen(30),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: ThemeManager.colors.viewBorderColor,
    paddingHorizontal: areaDimen(2),
    flexDirection: 'row',
  },
  inputTextStyle: {
    flexGrow: 0.96,
    justifyContent: 'center',
  },
  textStyle: {
    fontFamily: Fonts.medium,
    fontSize: areaDimen(14),
    marginLeft: areaDimen(12),
    maxWidth: '96%',
  },

  iconViewStyle: {
    flexGrow: 0.04,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStyle: {
    height: areaDimen(10),
    width: areaDimen(10),
  },
  modalStyle: {
    height: areaDimen(100),
    borderWidth:1,
    top: areaDimen(10),
    width: '100%',
    alignSelf: 'center',
    borderRadius: areaDimen(10),
    overflow:'hidden'
  },
});
