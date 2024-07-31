import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {ThemeManager} from '../../../ThemeManager';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Loader from '../Screens/Loader/Loader';

const WrapperContainer = ({children, isLoading = false}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: ThemeManager.colors.dashboardBg,
        paddingTop: insets.top,
      }}>
      {children}
      {isLoading && <Loader />}
    </View>
  );
};

export default WrapperContainer;

const styles = StyleSheet.create({});
