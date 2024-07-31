import React, { memo } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

const ShimmerLoader = ({style, ...props}) => {
  return (
    <ShimmerPlaceHolder
      {...props}
      LinearGradient={LinearGradient}
      shimmerStyle={style}
    />
  );
};
export default memo(ShimmerLoader);
