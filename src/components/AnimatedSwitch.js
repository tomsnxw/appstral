import React,{useContext} from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { ThemeContext } from '../contexts/ThemeContext';

const SWITCH_WIDTH = 50;
const SWITCH_HEIGHT = 25;
const KNOB_SIZE = 25;

export default function AnimatedSwitch({ isEnabled, onToggle }) {
    const { theme } = useContext(ThemeContext);
  
  const knobPosition = useSharedValue(isEnabled ? 1 : 0);

  React.useEffect(() => {
    knobPosition.value = withTiming(isEnabled ? 1 : 0);
  }, [isEnabled]);

  const animatedKnobStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(knobPosition.value * (SWITCH_WIDTH - KNOB_SIZE )),
        },
      ],
    };
  });

  return (
    <Pressable
      onPress={onToggle}
      style={[
        styles(theme).switch,
        { backgroundColor: theme.background, borderWidth: 1, borderColor: "#CCCCCC" },
      ]}
    >
      <Animated.View style={[styles(theme).knob, animatedKnobStyle]}>
        <View style={{    margin: 'auto',
    width: KNOB_SIZE-12,
    height: KNOB_SIZE-12,
    borderRadius: KNOB_SIZE / 2,
    backgroundColor: isEnabled ? '#00b936': theme.red,
    position: 'absolute'}} ></View></Animated.View>
    </Pressable>
  );
}


const styles = (theme) => StyleSheet.create({
  switch: {
    width: SWITCH_WIDTH,
    height: SWITCH_HEIGHT,
    borderRadius: SWITCH_HEIGHT / 2,
    justifyContent: 'center',
  },
  knob: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    backgroundColor: '#d9d9d9',
    position: 'absolute',
    justifyContent: 'center',
    alignItems:'center',

  },
});
