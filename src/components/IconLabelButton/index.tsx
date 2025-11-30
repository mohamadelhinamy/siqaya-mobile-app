import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import {Typography} from '../Typography';
import {Colors} from '../../constants';
import {wp, hp} from '../../utils/responsive';
import ArrowLeftIcon from '../../assets/icons/outlined/arrow-left.svg';

interface IconLabelButtonProps {
  icon: React.ReactNode;
  label: string;
  secondaryLabel?: string;
  onPress?: (event: GestureResponderEvent) => void;
  style?: any;
  iconRight?: React.ReactNode; // optional right-side icon override
  disabled?: boolean;
}

const IconLabelButton: React.FC<IconLabelButtonProps> = ({
  icon,
  label,
  onPress,
  style,
  iconRight,
  secondaryLabel,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}>
      <View style={styles.leftRow}>
        <View style={styles.iconWrapper}>{icon}</View>
        <Typography variant="body1" text={label} color="textPrimary" />
      </View>

      <View style={styles.rightIconRow}>
        {secondaryLabel ? (
          <Typography variant="body2" text={secondaryLabel} color="textSecondary" />
        ) : null}

        <View style={styles.rightIcon}>
          {iconRight ? iconRight : <ArrowLeftIcon width={wp(5)} height={wp(5)} />}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
  },
  iconWrapper: {
    width: wp(8),
    height: wp(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
  },
  rightIcon: {},
});

export default IconLabelButton;
