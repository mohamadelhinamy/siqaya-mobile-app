import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {Typography} from '../Typography';
import {Colors} from '../../constants';
import {wp, hp} from '../../utils/responsive';
import {riyalIcon} from '../Icons';
import {useLanguage} from '../../context';

// Icons
import TickSquareIcon from '../../assets/icons/outlined/tick-square.svg';
import InfoCircleIcon from '../../assets/icons/outlined/info-circle.svg';
import CloseCircleIcon from '../../assets/icons/outlined/close-circle.svg';

interface DonationProduct {
  id: number;
  guid?: string;
  name: string | null;
  image: string | null;
}

interface DonationItem {
  id: number;
  item_type: string;
  item_name: string;
  item_description: string | null;
  unit_price: number;
  quantity: number;
  subtotal: number;
  discount_amount: number;
  total_amount: number;
  product?: DonationProduct;
}

interface DonationPath {
  id: number;
  name: string;
}

interface DonationCardProps {
  invoiceNumber: string;
  status: 'paid' | 'pending' | 'failed' | string;
  totalAmount: number;
  paidAt: string;
  createdAt: string;
  items: DonationItem[];
  donationPath: DonationPath | null;
  onPress?: () => void;
  onProductDetailsPress?: (productGuid: string) => void;
}

export const DonationCard: React.FC<DonationCardProps> = ({
  invoiceNumber,
  status,
  totalAmount,
  paidAt,
  createdAt,
  items,
  donationPath,
  onPress,
  onProductDetailsPress,
}) => {
  const {t} = useLanguage();

  const getStatusConfig = (statusValue: string) => {
    switch (statusValue) {
      case 'paid':
        return {
          color: '#4CAF50',
          bgColor: '#E8F5E9',
          text: t('donations.status.paid'),
          Icon: TickSquareIcon,
        };
      case 'pending':
        return {
          color: '#FF9800',
          bgColor: '#FFF3E0',
          text: t('donations.status.pending'),
          Icon: InfoCircleIcon,
        };
      case 'failed':
        return {
          color: '#F44336',
          bgColor: '#FFEBEE',
          text: t('donations.status.failed'),
          Icon: CloseCircleIcon,
        };
      default:
        return {
          color: Colors.text.secondary,
          bgColor: '#F5F5F5',
          text: statusValue,
          Icon: InfoCircleIcon,
        };
    }
  };

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.Icon;

  // Check if this is a product donation (item_type === 'donation' means it's a product donation)
  const productItem = items.find(item => item.item_type === 'donation');
  const hasProductImage = productItem?.product?.image;

  // Get donation type label
  const getDonationTypeLabel = () => {
    // Product donation
    if (productItem) {
      return productItem.product?.name || t('donations.labels.productDonation');
    }
    // Path donation
    if (donationPath) {
      return donationPath.name;
    }
    // Public donation
    return t('donations.labels.publicDonation');
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={!onPress}>
      {/* Header Section with Product Image or Colored Background */}
      <View style={styles.headerWrapper}>
        <View style={styles.headerContainer}>
          {hasProductImage ? (
            <Image
              source={{uri: productItem.product!.image!}}
              style={styles.productImage}
            />
          ) : (
            <View style={styles.headerBackground} />
          )}

          {/* Badges Row */}
          <View style={styles.badgesRow}>
            {/* Donation Type Badge */}
            <View style={styles.pathBadge}>
              <Typography
                variant="caption"
                text={getDonationTypeLabel()}
                style={styles.pathText}
              />
            </View>

            {/* Status Badge */}
            <View
              style={[
                styles.statusBadge,
                {backgroundColor: statusConfig.bgColor},
              ]}>
              <StatusIcon
                width={wp(3.5)}
                height={wp(3.5)}
                color={statusConfig.color}
              />
              <Typography
                variant="caption"
                text={statusConfig.text}
                style={[styles.statusText, {color: statusConfig.color}]}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        {/* Invoice Number */}
        <Typography
          variant="caption"
          text={invoiceNumber}
          color="textSecondary"
          style={styles.invoiceNumber}
        />

        {/* Items Section with Background */}
        <View style={styles.itemsSection}>
          {/* Labels Row */}
          <View style={styles.labelsRow}>
            <Typography
              variant="caption"
              text={t('donations.labels.item')}
              color="textSecondary"
              style={styles.labelText}
            />
            <Typography
              variant="caption"
              text={t('donations.labels.amount')}
              color="textSecondary"
              style={styles.labelText}
            />
          </View>

          {/* Items */}
          {items.map((item, index) => {
            // Use product name if available, otherwise use item_name
            const displayName = item.product?.name || item.item_name;
            return (
              <View key={item.id || index} style={styles.itemRow}>
                <View style={styles.itemNameContainer}>
                  {item.product?.image && (
                    <Image
                      source={{uri: item.product.image}}
                      style={styles.itemProductImage}
                    />
                  )}
                  <Typography
                    variant="body2"
                    text={displayName}
                    style={styles.itemName}
                    numberOfLines={2}
                  />
                </View>
                <View style={styles.amountContainer}>
                  <Typography
                    variant="h6"
                    text={item.total_amount.toLocaleString('ar-SA')}
                    color="primary"
                    style={styles.itemAmount}
                  />
                  {React.createElement(riyalIcon, {
                    width: wp(4),
                    height: wp(4),
                  })}
                </View>
              </View>
            );
          })}

          {/* Total Row */}
          <View style={styles.totalRow}>
            <Typography
              variant="body2"
              text={t('donations.labels.total')}
              style={styles.totalLabel}
            />
            <View style={styles.amountContainer}>
              <Typography
                variant="h5"
                text={totalAmount.toLocaleString('ar-SA')}
                color="primary"
                style={styles.totalAmount}
              />
              {React.createElement(riyalIcon, {width: wp(5), height: wp(5)})}
            </View>
          </View>
        </View>

        {/* Product Details Button - Only for product donations */}
        {productItem?.product?.guid && onProductDetailsPress && (
          <TouchableOpacity
            style={styles.productDetailsButton}
            onPress={() => onProductDetailsPress(productItem.product!.guid!)}
            activeOpacity={0.7}>
            <Typography
              variant="body2"
              text={t('donations.labels.productDetails')}
              color="primary"
              style={styles.productDetailsText}
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: wp(5),
    borderWidth: 1,
    borderColor: '#E5E5E5',
    overflow: 'hidden',
    marginBottom: hp(2),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerWrapper: {
    padding: wp(4),
    paddingBottom: hp(1),
  },
  headerContainer: {
    position: 'relative',
    height: hp(8),
    borderRadius: wp(3),
    overflow: 'hidden',
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.primary,
    opacity: 0.1,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badgesRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(3),
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: wp(4),
    gap: wp(1.5),
  },
  statusText: {
    fontWeight: '600',
    fontSize: wp(3),
  },
  pathBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: wp(4),
  },
  pathText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: wp(3),
  },
  content: {
    paddingHorizontal: wp(4),
    paddingBottom: wp(4),
  },
  invoiceNumber: {
    marginBottom: hp(1.5),
    textAlign: 'right',
  },
  itemsSection: {
    backgroundColor: '#F8F9FA',
    borderRadius: wp(3),
    padding: wp(4),
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1),
    paddingBottom: hp(1),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  labelText: {
    fontSize: wp(3),
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(1),
  },
  itemNameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  itemProductImage: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(2),
  },
  itemName: {
    flex: 1,
    textAlign: 'left',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
  },
  itemAmount: {
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: hp(1.5),
    marginTop: hp(1),
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  totalLabel: {
    fontWeight: '600',
  },
  totalAmount: {
    fontWeight: 'bold',
  },
  footer: {
    marginTop: hp(1.5),
    alignItems: 'flex-end',
  },
  productDetailsButton: {
    marginTop: hp(1.5),
    paddingVertical: hp(1.2),
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: wp(2),
    alignItems: 'center',
  },
  productDetailsText: {
    fontWeight: '600',
  },
});

export default DonationCard;
