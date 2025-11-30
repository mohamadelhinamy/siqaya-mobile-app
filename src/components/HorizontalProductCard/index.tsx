import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {Typography} from '../Typography';
import {CustomButton} from '../CustomButton';
import {riyalIcon, LocationIcon, ProfileTwoUsersIcon} from '../Icons';
import {Colors} from '../../constants';
import {hp, wp} from '../../utils/responsive';
import {useLanguage} from '../../context';

import ShoppingCartIcon from '../../assets/icons/outlined/shopping-cart.svg';

export interface HorizontalProductCardProps {
  id: string;
  title: string;
  raisedAmount: string;
  remainingAmount: string;
  progress: number; // 0-1 value
  image?: any;
  category: string;
  location: string;
  dealersCount: number;
  onDonate?: () => void;
  onViewDetails?: () => void;
  onAddToCart?: () => void;
  onPress?: () => void;
  style?: any;
}

export const HorizontalProductCard: React.FC<HorizontalProductCardProps> = ({
  id,
  title,
  raisedAmount,
  remainingAmount,
  progress,
  image,
  category,
  location,
  dealersCount,
  onDonate,
  onViewDetails,
  onAddToCart,
  onPress,
  style,
}) => {
  const {t} = useLanguage();
  const defaultOnDonate = () => {
    console.log('Donate button pressed for product:', id);
  };

  const defaultOnViewDetails = () => {
    console.log('View details pressed for product:', id);
  };

  return (
    <TouchableOpacity
      style={[styles.productCard, style]}
      onPress={onPress}
      activeOpacity={0.8}>
      {/* Right Side - Image */}
      <View style={styles.rightImage}>
        <View style={styles.imageContainer}>
          {image ? (
            <Image source={image} style={styles.productImage} />
          ) : (
            <View style={[styles.productImage, styles.placeholderImage]}>
              <Typography
                variant="h3"
                text="🏺"
                style={styles.placeholderText}
              />
            </View>
          )}

          {/* Location Info at Top of Image */}
          <View style={styles.locationContainer}>
            <View style={styles.locationBadge}>
              <View style={styles.badgeContent}>
                <LocationIcon
                  width={wp(3)}
                  height={wp(3)}
                  color={Colors.primary}
                />
                <Typography
                  variant="caption"
                  color="primary"
                  text={location}
                  style={styles.locationText}
                />
              </View>
            </View>
          </View>

          {/* Dealers Badge */}
          <View style={styles.dealersContainer}>
            <View style={styles.dealersBadge}>
              <View style={styles.badgeContent}>
                <ProfileTwoUsersIcon
                  width={wp(3)}
                  height={wp(3)}
                  color={Colors.primary}
                />
                <Typography
                  variant="caption"
                  color="primary"
                  text={`${dealersCount}`}
                  style={styles.dealersText}
                />
              </View>
            </View>
          </View>

          {/* Category Badge */}
          <View style={styles.categoryBadge}>
            <Typography
              variant="caption"
              color="white"
              text={category}
              style={styles.categoryText}
            />
          </View>
        </View>
      </View>

      {/* Left Side - Content */}
      <View style={styles.leftContent}>
        {/* Title */}
        <Typography
          variant="subtitle2"
          color="textPrimary"
          text={title}
          numberOfLines={2}
          style={styles.cardTitle}
        />

        {/* Progress Section */}
        <View style={styles.progressSection}>
          {/* Funding Information */}
          <View style={styles.fundingContainer}>
            <View style={styles.fundingColumn}>
              <Typography
                variant="caption"
                color="textSecondary"
                text={t('products.raised')}
                style={styles.fundingLabel}
              />
              <View style={styles.amountRow}>
                <Typography
                  variant="h6"
                  color="textPrimary"
                  text={raisedAmount.replace('ر.س', '').trim()}
                  style={styles.amount}
                />
                {React.createElement(riyalIcon, {
                  width: wp(3.5),
                  height: wp(3.5),
                })}
              </View>
            </View>

            <View style={styles.fundingColumn}>
              <Typography
                variant="caption"
                color="textSecondary"
                text={t('products.remaining')}
                style={styles.fundingLabel}
              />
              <View style={styles.amountRow}>
                <Typography
                  variant="h6"
                  color="textPrimary"
                  text={remainingAmount.replace('ر.س', '').trim()}
                  style={styles.amount}
                />
                {React.createElement(riyalIcon, {
                  width: wp(3.5),
                  height: wp(3.5),
                })}
              </View>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, {width: `${progress * 100}%`}]}>
                <View style={styles.progressTextOverlay}>
                  <Typography
                    variant="caption"
                    color="white"
                    text={`${Math.round(progress * 100)}%`}
                    style={styles.progressText}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <CustomButton
            title={t('products.donateNow')}
            variant="primary"
            size="small"
            onPress={onDonate || defaultOnDonate}
            style={styles.donateButton}
          />
          <CustomButton
            variant="icon"
            size="small"
            icon={
              <ShoppingCartIcon
                color={Colors.text.primary}
                width={wp(4.5)}
                height={wp(4.5)}
              />
            }
            onPress={onAddToCart || onViewDetails || defaultOnViewDetails}
            style={styles.cartButton}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: wp(5),
    borderWidth: 1,
    borderColor: '#E5E5E5',
    overflow: 'hidden',
    flexDirection: 'row',
    minHeight: hp(22),
    maxHeight: hp(28),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rightImage: {
    width: wp(40),
    paddingTop: wp(4),
    paddingLeft: wp(4),
    paddingBottom: wp(4),
  },
  leftContent: {
    flex: 1,
    padding: wp(4),
    justifyContent: 'space-between',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    borderRadius: wp(3),
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: wp(6),
  },
  locationContainer: {
    position: 'absolute',
    top: wp(2),
    left: wp(2),
    right: wp(2),
  },
  locationBadge: {
    backgroundColor: 'rgba(232, 244, 253, 0.9)',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.6),
    borderRadius: wp(4),
    alignSelf: 'flex-start',
  },
  dealersContainer: {
    position: 'absolute',
    top: wp(2),
    right: wp(2),
  },
  dealersBadge: {
    backgroundColor: 'rgba(232, 244, 253, 0.9)',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.6),
    borderRadius: wp(4),
    alignItems: 'center',
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
  },
  locationText: {
    fontSize: wp(2.5),
    fontWeight: '600',
  },
  dealersText: {
    fontSize: wp(2.5),
    fontWeight: '600',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.6),
    borderTopLeftRadius: wp(3),
  },
  categoryText: {
    fontSize: wp(2.5),
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: wp(4),
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: hp(0.5),
    lineHeight: wp(5),
    textAlign: 'left',
  },
  progressSection: {
    backgroundColor: '#F8F9FA',
    borderRadius: wp(3),
    padding: wp(2.5),
    marginBottom: hp(0.8),
  },
  fundingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1),
  },
  fundingColumn: {
    alignItems: 'center',
  },
  fundingLabel: {
    fontSize: wp(2.5),
    color: Colors.text.secondary,
    marginBottom: hp(0.3),
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(0.5),
  },
  amount: {
    fontSize: wp(3.5),
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  progressBarContainer: {
    position: 'relative',
  },
  progressBar: {
    height: hp(2),
    backgroundColor: '#E5E5E5',
    borderRadius: wp(3),
    overflow: 'hidden',
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#03A9F4',
    borderRadius: wp(3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTextOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: wp(2.5),
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    height: hp(4.5),
    marginBottom: hp(0.5),
  },
  donateButton: {
    flex: 1,
    borderRadius: wp(6),
    margin: 0,
    marginBottom: 0,
    paddingVertical: hp(1),
    minHeight: hp(4.5),
  },
  cartButton: {
    width: hp(4.5),
    // height: hp(4.5),
    margin: 0,
    marginBottom: 0,
    paddingVertical: hp(1),
  },
  detailsLink: {
    marginTop: 0,
    alignItems: 'center',
    paddingVertical: hp(0.2),
  },
  detailsText: {
    fontSize: wp(3),
    color: Colors.text.primary,
    textDecorationLine: 'underline',
  },
});
