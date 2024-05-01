/* eslint-disable react-native/no-inline-styles */
import React, { useCallback } from 'react';
import { Text, StyleSheet, TouchableOpacity, Image, View } from 'react-native';
import { Colors, Fonts, Images } from '../../theme';
import LinearGradient from 'react-native-linear-gradient';
import Singleton from '../../Singleton';
import { ThemeManager } from '../../../ThemeManager';
import { areaDimen, heightDimen, widthDimen } from '../../Utils/themeUtils';
import fonts from '../../theme/Fonts';

const KeyboardDigit = ({
    key,
    digit,
    onPress,
    updatePin,
    deletePin,

}) => {

    const Digit = useCallback(({ digit, onPress }) => {
        return (
            <>
                {digit == " " ? (
                    <View style={styles.digitStyle}>
                        {/* // <View style={[styles.digitStyle, styles.rightLine]}> */}
                        <Text
                            style={{
                                fontSize: areaDimen(20),
                                fontFamily: fonts.semibold,
                                color: ThemeManager.colors.textColor,
                            }}
                        >
                            {digit}
                        </Text>
                    </View>
                ) : (
                    <TouchableOpacity
                        onPress={onPress}
                        activeOpacity={1}
                        style={[styles.digitStyle]
                            // digit == "1" || digit == "2"
                            //   ? [styles.digitStyle, styles.topRightLine]
                            //   : digit == "3"
                            //     ? [styles.digitStyle, styles.topLine]
                            //     : digit == "4" ||
                            //       digit == "5" ||
                            //       digit == "7" ||
                            //       digit == "8" ||
                            //       digit == " " ||
                            //       digit == "0"
                            //       ? [styles.digitStyle, styles.rightLine]
                            //       : [styles.digitStyle]
                        }
                    >
                        <Text
                            style={{
                                fontSize: areaDimen(20),
                                fontFamily: fonts.semibold,
                                color: ThemeManager.colors.textColor,
                            }}
                        >
                            {digit}
                        </Text>
                    </TouchableOpacity>
                )}
            </>
        );
    }, []);

    const DigitImage = useCallback(({ onPress }) => {
        return (
            <TouchableOpacity onPress={onPress} style={styles.digitImageStyle}>
                <Image
                    source={ThemeManager.ImageIcons.delImage}
                    style={{
                        height: widthDimen(17),
                        width: widthDimen(21),
                        tintColor: ThemeManager.colors.textColor,
                    }}
                    resizeMode="contain"
                />
            </TouchableOpacity>
        );
    }, []);

    // return (
    //     <>
    //         {digit == " " ? (
    //             <View style={styles.digitStyle}>
    //                 {/* // <View style={[styles.digitStyle, styles.rightLine]}> */}
    //                 <Text
    //                     style={{
    //                         fontSize: areaDimen(20),
    //                         fontFamily: fonts.semibold,
    //                         color: ThemeManager.colors.textColor,
    //                     }}
    //                 >
    //                     {digit}
    //                 </Text>
    //             </View>
    //         ) : (
    //             <TouchableOpacity
    //                 onPress={onPress}
    //                 activeOpacity={1}
    //                 style={[styles.digitStyle]
    //                     // digit == "1" || digit == "2"
    //                     //   ? [styles.digitStyle, styles.topRightLine]
    //                     //   : digit == "3"
    //                     //     ? [styles.digitStyle, styles.topLine]
    //                     //     : digit == "4" ||
    //                     //       digit == "5" ||
    //                     //       digit == "7" ||
    //                     //       digit == "8" ||
    //                     //       digit == " " ||
    //                     //       digit == "0"
    //                     //       ? [styles.digitStyle, styles.rightLine]
    //                     //       : [styles.digitStyle]
    //                 }
    //             >
    //                 <Text
    //                     style={{
    //                         fontSize: areaDimen(20),
    //                         fontFamily: fonts.semibold,
    //                         color: ThemeManager.colors.textColor,
    //                     }}
    //                 >
    //                     {digit}
    //                 </Text>
    //             </TouchableOpacity>
    //         )}
    //     </>
    // );

    return (
        <View
            style={{
                alignItems: "center",
                justifyContent: "flex-end",
                flexDirection: "row",
                flexWrap: "wrap",
            }}
        >
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", " ", "0"].map(
                (item, index) => {
                    return (
                        <Digit
                            key={index}
                            digit={item}
                            // onPress={() => updatePin(item)}
                            onPress={() => updatePin(item)}
                        />
                    );
                }
            )}

            <DigitImage onPress={() => deletePin()} />
        </View>
    )
};

const styles = StyleSheet.create({

    rightLine: {
        borderRightColor: Colors.pinLineColor,
        borderRightWidth: 0.5,
    },
    digitStyle: {
        width: "33.33%",
        alignItems: "center",
        padding: "5%",
        borderBottomColor: Colors.pinLineColor,
        // backgroundColor:'red'
        // borderBottomWidth: 0.5,
    },
    topRightLine: {
        borderTopColor: Colors.pinLineColor,
        borderTopWidth: 0.5,
        borderRightColor: Colors.pinLineColor,
        borderRightWidth: 0.5,
    },
    topLine: {
        borderTopColor: Colors.pinLineColor,
        borderTopWidth: 0.5,
    },

    digitImageStyle: {
        width: "33.33%",
        alignItems: "center",
        padding: "6.1%",
        borderBottomColor: Colors.pinLineColor,
        // borderBottomWidth: 0.5,
    },
});

export { KeyboardDigit };
