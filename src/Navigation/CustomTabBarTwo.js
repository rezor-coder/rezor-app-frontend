import React, {useEffect, useState} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {EventRegister} from 'react-native-event-listeners';
import {useSelector} from 'react-redux';
import {ThemeManager} from '../../ThemeManager';
import {areaDimen, heightDimen} from '../Utils/themeUtils';
import Singleton from '../Singleton';
import fonts from '../theme/Fonts';

const CustomTabBarTwo = ({state, descriptors, navigation}) => {
  const [theme, setTheme] = useState(1);

  useEffect(() => {
    EventRegister.addEventListener('themeChanged', data => {
      setTheme(data);
    });
  }, [theme]);
  return (
    <View
      style={[
        styles.ViewStyle,
        {
          borderColor: ThemeManager.colors.tabBorder,
          backgroundColor: ThemeManager.colors.backgroundColor,
        },
      ]}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const focused = state.index === index;
        const onPress = () => {
          Singleton.fromWatchList = false;
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };
        return (
          <TouchableOpacity
            key={index}
            activeOpacity={0.9}
            onPress={onPress}
            style={styles.touchable}>
            {options?.tabBarIcon({focused})
              ? options?.tabBarIcon({focused})
              : null}
              
            <Text
              style={{
                ...styles.labelStyle,
                color: !!focused
                  ? ThemeManager.colors.primary
                  : ThemeManager.colors.textColor,
              }}>
              {options?.tabBarLabel}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
export default CustomTabBarTwo;

const styles = StyleSheet.create({
  ViewStyle: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: Platform.OS == 'ios'?'flex-end':'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: heightDimen(80),
    flexWrap: 'nowrap',
    borderWidth: 0.3,
    borderBottomWidth: 0,
    borderTopStartRadius: areaDimen(20),
    borderTopEndRadius: areaDimen(20),
    overflow: 'hidden',
    paddingBottom: Platform.OS == 'ios' ? heightDimen(20) : 0,
    borderWidth: 1,
  },
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelStyle: {
    marginTop: heightDimen(2.5),
    fontSize: areaDimen(12),
    lineHeight: areaDimen(15),
    fontFamily: fonts.semibold,
    textAlign: 'center',
  },
});
