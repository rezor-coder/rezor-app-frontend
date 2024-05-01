/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors, Fonts, Images } from '../../theme';
import LinearGradient from 'react-native-linear-gradient';
import Singleton from '../../Singleton';
import { ThemeManager } from '../../../ThemeManager';
import { areaDimen, heightDimen } from '../../Utils/themeUtils';
import { View } from 'native-base';

const LightButton = props => {

    return (
        <View style={props.btnStyle}>
            <TouchableOpacity
                disabled={props.disabled}
                style={[styles.buttonStyle, props.customGradient,{backgroundColor:ThemeManager.colors.lightButton}]}
                onPress={props.onPress}>

                {props.rightImage && (
                    <Image
                        source={props.icon ? props.icon : Images.addIcon}
                        style={[
                            {
                                height: 20,
                                width: 20,
                                marginRight: 10,
                                resizeMode: 'contain',
                            },
                            props.iconStyle,
                        ]}
                    />
                )}

                <Text style={[styles.buttonText, props.textStyle,{color:ThemeManager.colors.textColor}]}>{props.text}</Text>
                {
                    props.rightImage1 && (
                        <Image
                            source={props.icon1 ? props.icon1 : Images.addIcon}
                            style={[
                                {
                                    height: 20,
                                    width: 20,
                                    marginRight: 10,
                                    resizeMode: 'contain',
                                },
                                props.iconStyle1,
                            ]}
                        />
                    )
                }
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    // gradientStyle: {
    //     width: '100%',
    //     height: 50,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     borderRadius: 4,
    //     flexDirection: 'row',
    // },
    buttonStyle: {
        width: '100%',
        height: heightDimen(60),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: "#363636",
    },
    buttonText: {
        color: Colors.white,
        fontSize: areaDimen(17),
        fontFamily: Fonts.semibold,
    },
});

export { LightButton };
