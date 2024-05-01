import React from 'react';
import {StatusBar} from 'react-native';
import { ThemeManager } from '../../../ThemeManager';

const MainStatusBar = props => {
  console.log(":::::::::::::",props.backgroundColor);
  return (
    <StatusBar
      backgroundColor={props.backgroundColor || ThemeManager.colors.bg}
      barStyle={props.barStyle}
    />
  );
};

export {MainStatusBar};
