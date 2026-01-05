import React from 'react';
import { Image, ImageProps, StyleSheet, View } from 'react-native';

type Props = {
  size?: number;
} & ImageProps;

export default function Logo({ size = 40, style, ...rest }: Props) {
  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      <Image
        source={require('../assets/images/logo1.png')}
        style={[styles.image, { width: size, height: size }, style]}
        resizeMode="contain"
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 40,
    height: 40,
  },
});
