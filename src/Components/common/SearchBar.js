import React from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  Pressable,
  Platform
} from 'react-native';
import { ThemeManager } from '../../../ThemeManager';
import { Fonts } from '../../theme';
import Colors from '../../theme/Colors';
import { areaDimen, heightDimen, widthDimen } from '../../Utils/themeUtils';

const SearchBar = props => {
  return (
    <View
      style={{
        flexDirection: 'row',
        height: heightDimen(50),
        borderRadius: heightDimen(25),
        width:widthDimen(370),
        borderColor: ThemeManager.colors.viewBorderColor,
        borderWidth: 1,
        backgroundColor: ThemeManager.colors.bg,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: widthDimen(22),
        alignSelf:'center'
      }}>


      <TextInput
        //    style={[{  flexDirection: 'row',  alignItems: 'center', justifyContent: 'space-between',   paddingHorizontal: 17, paddingTop: 10  },
        //    props.containerStyle,
        //  ]}
        style={[{
          fontSize: areaDimen(14),
          color: ThemeManager.colors.textColor, marginVertical: Platform.OS === 'ios' ? 10 : 0,
          fontFamily:Fonts.medium
          // backgroundColor:'red'
        }, props.titleStyle,
        {
          width: props.width,
          // backgroundColor: 'transparent',
          height: '100%',
          paddingRight: widthDimen(30),
          position: 'absolute',
          zIndex: 4
        },
        ]}
        onChangeText={props?.onChangeText}
        value={props.text}
        placeholder={props.placeholder}
        returnKeyType={props.returnKeyType}
        placeholderTextColor={Colors.languageItem}
        secureTextEntry={props.secureTextEntry}
        onBlur={() => {
          setTimeout(
            () => props.setOpenSearch && props.setOpenSearch(false),
            100,
          );
        }}
        onSubmitEditing={props.onSubmitEditing}
      // autoFocus={true}
      />

      <TouchableOpacity
        disabled={false}
        activeOpacity={props.activeOpacity}
        style={[styles.imgstyle, props.imgstyle]}
        onPress={props.onPress}
      >
        <Image source={props.icon} style={[{
          height: widthDimen(16),
          width: widthDimen(16),
        },
        props?.ImageStyle ? props?.ImageStyle : {}]} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    fontSize: 15,
    paddingLeft: 20,
    borderRadius: 4,
    color: Colors.languageItem,
    backgroundColor: ThemeManager.colors.mnemonicsUnSelectedText,
    paddingRight: 50,
  },
  imgstyle: {
    position: 'absolute',
    width: widthDimen(30),
    height: heightDimen(44),
    resizeMode: 'contain',
    justifyContent: 'center',
    right: widthDimen(10),
    zIndex: 2,
  },
});

export { SearchBar };
