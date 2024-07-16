import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {LanguageManager, ThemeManager} from '../../ThemeManager';
import {
  Dashboard,
  DefiAccessmainIOS,
  Market,
  SwapNew,
  Wallet,
} from '../Components/Screens';
import {heightDimen, widthDimen} from '../Utils/themeUtils';
import {Images} from '../theme';
import CustomTabBarTwo from './CustomTabBarTwo';
import {NavigationStrings} from './NavigationStrings';

const Tab = createBottomTabNavigator();

const TabRoutes = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBarTwo {...props} />}
      initialRouteName={NavigationStrings.Wallet}
      screenOptions={{
        headerShown: false,
        swipeEnabled: false,
        gestureEnabled: false,
      }}>
      <Tab.Screen
        name={NavigationStrings.Dashboard}
        component={Dashboard}
        options={{
          tabBarLabel: LanguageManager.Home,
          tabBarIcon: ({focused}) => {
            return (
              <Image
                source={focused ? Images.home_active : Images.home_inactive}
                style={styles.iconStyle}
                tintColor={
                  !!focused
                    ? ThemeManager.colors.primary
                    : ThemeManager.colors.iconColor
                }
              />
            );
          },
        }}
      />
      <Tab.Screen
        name={NavigationStrings.Market}
        component={Market}
        options={{
          tabBarLabel: LanguageManager.Market,
          tabBarIcon: ({focused}) => {
            return (
              <Image
                source={
                  focused
                    ? ThemeManager.ImageIcons.marketActive
                    : Images.market_inactive
                }
                style={styles.iconStyle}
                tintColor={
                  !!focused
                    ? ThemeManager.colors.primary
                    : ThemeManager.colors.iconColor
                }
              />
            );
          },
        }}
      />
      <Tab.Screen
        name={NavigationStrings.Trade}
        component={SwapNew}
        options={{
          tabBarLabel: 'Swap',
          unmountOnBlur:true,
          tabBarIcon: ({focused}) => {
            return (
              <Image
                source={focused ? Images.tradeActive : Images.tradeInActive}
                style={styles.iconStyle}
                tintColor={
                  !!focused
                    ? ThemeManager.colors.primary
                    : ThemeManager.colors.iconColor
                }
              />
            );
          },
        }}
      />
      <Tab.Screen
        name={NavigationStrings.Wallet}
        component={Wallet}
        options={{
          tabBarLabel: NavigationStrings.Wallet,
          tabBarIcon: ({focused}) => {
            return (
              <Image
                source={focused ? Images.wallet_active : Images.wallet_inactive}
                style={styles.iconStyle}
                tintColor={
                  !!focused
                    ? ThemeManager.colors.primary
                    : ThemeManager.colors.iconColor
                }
              />
            );
          },
        }}
      />
      <Tab.Screen
        name={NavigationStrings.DeFi}
        component={DefiAccessmainIOS}
        options={{
          tabBarLabel: LanguageManager.defi,
          tabBarIcon: ({focused}) => {
            return (
              <Image
                source={focused ? Images.defiActiveNew : Images.defiInActiveNew}
                style={[styles.iconStyle]}
                tintColor={
                  !!focused
                    ? ThemeManager.colors.primary
                    : ThemeManager.colors.iconColor
                }
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default TabRoutes;
const styles = StyleSheet.create({
  iconStyle: {
    height: heightDimen(20),
    width: widthDimen(17),
    resizeMode: 'contain',
  },
});
