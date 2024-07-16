import {BlurView} from '@react-native-community/blur';
import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {areaDimen, height} from '../../Utils/themeUtils';
import {Colors, Images} from '../../theme';
import FastImage from 'react-native-fast-image';
import {ThemeManager} from '../../../ThemeManager';
const BlurBottomModal = ({
  children,
  modalHeight,
  onRequestClose,
  visible,
  blurType = 'dark',
  blurColor = Colors.modalBackdrop,
  onPressCloseSheet = () => {},
}) => {
  return (
    <Modal visible={visible} transparent onRequestClose={onRequestClose}>
      <BlurView
        style={styles.blurStyle}
        blurType={blurType}
        overlayColor={blurColor}
        key={1}
      />
      <View style={styles.mainContainerStyle}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={Platform.OS == 'android'?-300:0}
          style={{flex: 1, justifyContent: 'flex-end'}}
          behavior="position">
          <View
            style={[
              styles.containerStyle,
              {
                height: modalHeight,
                backgroundColor: ThemeManager.colors.backgroundColor,
              },
            ]}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="never"
              enableOnAndroid={true}
              bounces={false}>
              <TouchableOpacity
                style={styles.closeButtonView}
                onPress={onPressCloseSheet}>
                <FastImage
                  source={Images.circleCross}
                  style={styles.closeButton}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              {children}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default BlurBottomModal;

const styles = StyleSheet.create({
  mainContainerStyle: {
    flex: 1,
    zIndex: 100,
    justifyContent: 'flex-end',
  },
  containerStyle: {
    height: height / 3,
    borderTopLeftRadius: areaDimen(24),
    borderTopRightRadius: areaDimen(24),
  },
  blurStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  closeButtonView: {
    position: 'absolute',
    right: areaDimen(16),
    top: areaDimen(18),
    zIndex: 10,
  },
  closeButton: {
    height: areaDimen(24),
    width: areaDimen(24),
  },
});
