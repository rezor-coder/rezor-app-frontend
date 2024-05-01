/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { ThemeManager } from '../../../ThemeManager';
import { Fonts, Colors, Images } from '../../theme';
import { areaDimen, heightDimen } from '../../Utils/themeUtils';

const CheckBox = props => {
  const [cBox, setCBox] = useState(false);

  const onHandleCheckBox = () => {
    setCBox(prevCBox => !prevCBox);
  };

  return (
    <TouchableOpacity
      onPress={(onHandleCheckBox, props.onHandleCheckBox)}
      style={[styles.checkboxStyle, props.checkboxstyle]}>
      <View style={[styles.checkBox_wrap, { marginLeft: props.checkBoxLeft }]}>
        <TouchableOpacity onPress={(onHandleCheckBox, props.onHandleCheckBox)}>
          {props.isStored ? (
            <Image
              style={[{
                height: heightDimen(20),
                width: areaDimen(20),
                resizeMode: 'contain',
                borderRadius: areaDimen(4),
                tintColor: ThemeManager.colors.headingText
              }, props.checkboxstyle]}
              source={
                props.isStored
                  ? Images.check
                  : Images.check
              }
            // style={{tintColor:props.isStored ?  Images.checkbox_active: Images.checkbox_default}}
            />
          ) : (
            <View
              style={[{
                height: 20,
                width: 20,
                borderRadius: 5,
                borderWidth: 2,
                borderColor: props.checkboxColor,
              }, props.checkboxstyle]}
            />
          )}
        </TouchableOpacity>
      </View>
      <Text style={[styles.labelText, props.labelTextstyle]}>
        {props.label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkboxStyle: {
    flexDirection: 'row',
    height: 44,
    width: '100%',
  },
  checkBox_wrap: {
    marginLeft: 30,
  },
  labelText: {
    fontSize: areaDimen(14),
    fontFamily: Fonts.regular,
    color: Colors.checkboxLable,
    marginLeft: 15,
  },
});

export { CheckBox };
