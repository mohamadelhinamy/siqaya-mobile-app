import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {wp, hp} from '../../utils/responsive';
import {Colors} from '../../constants';

const ProductDetailsSkeleton: React.FC = () => {
  return (
    <View>
      <SkeletonPlaceholder>
        {/* Hero image */}
        <SkeletonPlaceholder.Item
          width={wp(100)}
          height={hp(25)}
          borderRadius={4}
        />

        {/* Pills row */}
        <SkeletonPlaceholder.Item
          flexDirection="row"
          paddingHorizontal={wp(4)}
          marginTop={hp(2)}>
          <SkeletonPlaceholder.Item
            width={wp(24)}
            height={hp(3)}
            borderRadius={wp(5)}
          />
          <SkeletonPlaceholder.Item
            marginLeft={wp(2)}
            width={wp(30)}
            height={hp(3)}
            borderRadius={wp(5)}
          />
        </SkeletonPlaceholder.Item>

        {/* Title */}
        <SkeletonPlaceholder.Item paddingHorizontal={wp(4)} marginTop={hp(2)}>
          <SkeletonPlaceholder.Item
            width={wp(70)}
            height={hp(3)}
            borderRadius={4}
          />
          <SkeletonPlaceholder.Item
            marginTop={hp(1)}
            width={wp(50)}
            height={hp(2)}
            borderRadius={4}
          />
        </SkeletonPlaceholder.Item>

        {/* Organization row */}
        <SkeletonPlaceholder.Item
          flexDirection="row"
          paddingHorizontal={wp(4)}
          alignItems="center"
          marginTop={hp(2)}>
          <SkeletonPlaceholder.Item
            width={wp(10)}
            height={wp(10)}
            borderRadius={wp(6)}
          />
          <SkeletonPlaceholder.Item
            marginLeft={wp(3)}
            width={wp(40)}
            height={hp(2)}
            borderRadius={4}
          />
        </SkeletonPlaceholder.Item>

        {/* Brief lines */}
        <SkeletonPlaceholder.Item paddingHorizontal={wp(4)} marginTop={hp(2)}>
          <SkeletonPlaceholder.Item
            width={wp(90)}
            height={hp(2)}
            borderRadius={4}
          />
          <SkeletonPlaceholder.Item
            marginTop={hp(1)}
            width={wp(85)}
            height={hp(2)}
            borderRadius={4}
          />
          <SkeletonPlaceholder.Item
            marginTop={hp(1)}
            width={wp(60)}
            height={hp(2)}
            borderRadius={4}
          />
        </SkeletonPlaceholder.Item>

        {/* Funding block */}
        <SkeletonPlaceholder.Item marginTop={hp(3)} paddingHorizontal={wp(4)}>
          <SkeletonPlaceholder.Item
            width={wp(90)}
            height={hp(12)}
            borderRadius={8}
          />
        </SkeletonPlaceholder.Item>

        {/* Stats grid */}
        <SkeletonPlaceholder.Item
          flexDirection="row"
          flexWrap="wrap"
          paddingHorizontal={wp(4)}
          marginTop={hp(3)}>
          <SkeletonPlaceholder.Item
            width={wp(44)}
            height={hp(12)}
            borderRadius={8}
            marginRight={wp(2)}
            marginBottom={hp(2)}
          />
          <SkeletonPlaceholder.Item
            width={wp(44)}
            height={hp(12)}
            borderRadius={8}
            marginBottom={hp(2)}
          />
          <SkeletonPlaceholder.Item
            width={wp(44)}
            height={hp(12)}
            borderRadius={8}
            marginRight={wp(2)}
            marginBottom={hp(2)}
          />
          <SkeletonPlaceholder.Item
            width={wp(44)}
            height={hp(12)}
            borderRadius={8}
            marginBottom={hp(2)}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  );
};

export default ProductDetailsSkeleton;
