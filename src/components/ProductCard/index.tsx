import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {Typography} from '../Typography';
import {CustomButton} from '../CustomButton';
import {riyalIcon, LocationIcon, ProfileTwoUsersIcon} from '../Icons';
import {Colors} from '../../constants';
import {hp, wp} from '../../utils/responsive';
import {useLanguage} from '../../context';

import ShoppingCartIcon from '../../assets/icons/outlined/shopping-cart.svg';

export interface ProductCardProps {
  id: string;
  guid: string;
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

export const ProductCard: React.FC<ProductCardProps> = ({
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

  const formatAmount = (amount: string) => {
    // Handle both Arabic and English numbers, remove currency symbols and spaces
    const numericValue = amount
      .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
      .replace(/[^\d]/g, '');
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <TouchableOpacity
      style={[styles.productCard, style]}
      onPress={onPress}
      activeOpacity={0.8}>
      {/* Image Container with Padding and Border Radius */}
      <View style={styles.imageWrapper}>
        <View style={styles.imageContainer}>
          {image ? (
            <Image source={{uri: image}} style={styles.productImage} />
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
                  text={`${t('products.dependents')}: ${dealersCount}`}
                  style={styles.dealersText}
                />
              </View>
            </View>
          </View>

          {/* Category Badge on Image */}
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

      {/* Card Content */}
      <View style={styles.cardContent}>
        {/* Title */}
        <Typography
          variant="subtitle2"
          color="textPrimary"
          text={title}
          numberOfLines={2}
          style={styles.cardTitle}
        />

        {/* Progress Bar Section with Background */}
        <View style={styles.progressSection}>
          {/* Funding Information - Side by Side */}
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
                  text={formatAmount(raisedAmount)}
                  style={styles.raisedAmount}
                />
                {React.createElement(riyalIcon, {width: wp(4), height: wp(4)})}
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
                  text={formatAmount(remainingAmount)}
                  style={styles.remainingAmount}
                />
                {React.createElement(riyalIcon, {width: wp(4), height: wp(4)})}
              </View>
            </View>
          </View>

          {/* Progress Bar with Percentage Text on it */}
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
            onPress={onDonate || defaultOnDonate}
            style={styles.donateButton}
          />
          <CustomButton
            variant="icon"
            icon={<ShoppingCartIcon color={Colors.text.primary} />}
            onPress={onAddToCart || onViewDetails || defaultOnViewDetails}
            style={styles.cartButton}
          />
        </View>

        {/* View Details Link */}
        {/* <TouchableOpacity
          style={styles.detailsLink}
          onPress={onViewDetails || defaultOnViewDetails}>
          <Typography
            variant="caption"
            color="textSecondary"
            text={t('products.viewDetails')}
            style={styles.detailsText}
          />
        </TouchableOpacity> */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    width: wp(80),
    backgroundColor: Colors.white,
    borderRadius: wp(5),
    borderWidth: 1,
    borderColor: '#E5E5E5',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageWrapper: {
    padding: wp(4),
    paddingBottom: hp(1),
  },
  imageContainer: {
    position: 'relative',
    height: hp(20),
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
    fontSize: wp(8),
  },
  locationContainer: {
    position: 'absolute',
    top: wp(3),
    left: wp(3),
    right: wp(3),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: wp(2),
  },
  locationBadge: {
    backgroundColor: 'rgba(232, 244, 253, 0.9)',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.6),
    borderRadius: wp(4),
    alignItems: 'center',
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
    fontSize: wp(2.8),
    fontWeight: '600',
  },
  dealersText: {
    fontSize: wp(2.8),
    fontWeight: '600',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderTopLeftRadius: wp(3),
  },
  categoryText: {
    fontSize: wp(3),
    fontWeight: '600',
  },
  cardContent: {
    padding: wp(4),
    paddingTop: hp(1),
  },
  cardTitle: {
    fontSize: wp(3.5),
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: hp(1.5),
    lineHeight: wp(4.5),
    textAlign: 'left',
  },
  progressSection: {
    backgroundColor: '#F8F9FA',
    borderRadius: wp(3),
    padding: wp(3),
    marginBottom: hp(2),
  },
  fundingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1.5),
  },
  fundingColumn: {
    alignItems: 'center',
  },
  fundingLabel: {
    fontSize: wp(3),
    color: Colors.text.secondary,
    marginBottom: hp(0.5),
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
  },
  raisedAmount: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  remainingAmount: {
    fontWeight: 'bold',
    fontSize: wp(4),
    color: Colors.text.primary,
  },
  progressBarContainer: {
    position: 'relative',
  },
  progressBar: {
    height: hp(2.5),
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
    paddingBottom: 0,
  },
  progressText: {
    fontSize: wp(3),
    fontWeight: '600',
    marginBottom: 0,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
    height: hp(4.5),
    marginBottom: hp(1),
  },
  donateButton: {
    flex: 1, // Use flex instead of percentage for better alignment
    borderRadius: wp(6),
    margin: 0,
    marginBottom: 0, // Override CustomButton's default marginBottom
  },
  cartButton: {
    width: hp(5.5), // Fixed width to match height
    margin: 0,
    marginBottom: 0, // Override CustomButton's default marginBottom
  },
  detailsLink: {
    marginTop: hp(3),
    alignItems: 'center',
    paddingVertical: hp(0.5),
  },
  detailsText: {
    fontSize: wp(4),
    color: Colors.text.primary,
    textDecorationLine: 'underline',
  },
});
