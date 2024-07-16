import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const { timing, interpolate, Extrapolate } = Animated;

const stepIndicatorWidth = 30;
const stepIndicatorHeight = 30;
const stepIndicatorSpacing = 10;
const stepIndicatorAnimationDuration = 300;

const StepIndicator = ({ steps, currentStep }) => {
  const stepIndicatorHeights = steps.map(() => {return useSharedValue(0)});
  console.log(stepIndicatorHeights[0].value,'stepIndicatorHeights');
//   const animateStepIndicatorHeight = (index) => {
//     const newValue = stepIndicatorHeight * (index + 1);
//     timing(stepIndicatorHeights[index].value, {
//       toValue: newValue,
//       duration: stepIndicatorAnimationDuration,
//       easing: Easing.inOut(Easing.ease),
//     }).start();
//   };

//   useEffect(() => {
//     for (let i = 0; i < currentStep; i++) {
//       animateStepIndicatorHeight(i);
//     }
//   }, [currentStep]);

  const renderStepIndicator = ({ item, index }) => {
    const isSelected = index === currentStep;
    const stepNumber = index + 1;

    return (
      <View style={styles.stepContainer}>
        <View
          style={[
            styles.stepIndicator,
            { backgroundColor: isSelected ? 'blue' : 'lightgray' },
          ]}
        >
          <Text style={styles.stepText}>{stepNumber}</Text>
        </View>
      </View>
    );
  };


  const animatedStyle = useAnimatedStyle(() => {
    const dashedLineHeight = interpolate(
      [0,stepIndicatorHeights,0],
      [0, stepIndicatorHeight * currentStep, 0],
      Extrapolate.CLAMP,
    );
    return {height: dashedLineHeight};
  });

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        <FlatList
          data={steps}
          style={{ flex: 0.9 }}
          renderItem={renderStepIndicator}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ justifyContent: 'center' }}
          showsVerticalScrollIndicator={false}
        />
        <View style={{ flex: 0.1 }}>
          <Animated.View
            style={[{
              borderLeftWidth: 1,
              borderStyle: 'dashed',
              borderColor: 'red',
            }, animatedStyle]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    alignItems: 'center',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: stepIndicatorSpacing,
  },
  stepIndicator: {
    width: stepIndicatorWidth,
    height: stepIndicatorHeight,
    borderRadius: stepIndicatorWidth / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    color: 'white',
    fontSize: 16,
  },
});

export default StepIndicator;
