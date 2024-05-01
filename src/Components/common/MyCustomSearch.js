import React from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import Colors from '../../theme/Colors';

const MyCustomSearch = props => {
  return (
    <View style={{flexDirection: 'row'}}>
      <TextInput
        style={props.style}
        onChangeText={props?.onChangeText}
        value={props.value}
        placeholder={props.placeholder}
        // returnKeyType={props.returnKeyType}
        placeholderTextColor={Colors.languageItem}
        onSubmitEditing={props.onSubmitEditing}
        editable={props.editable}
      />

      {props.editable && (
        <TouchableOpacity
          style={[styles.imgStyle, props.imgStyle]}
          onPress={props.onPressImg}>
          <Image source={props.icon} style={styles.iconStyle} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imgStyle: {
    marginLeft: -20,
    justifyContent: 'center',
  },
  iconStyle: {
    height: 18,
    width: 18,
  },
});

export {MyCustomSearch};
