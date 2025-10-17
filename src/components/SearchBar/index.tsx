import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  TextStyle,
} from 'react-native';
import {useLanguage} from '../../context';
import {Colors} from '../../constants';

// Import SVG icons properly
import SearchIcon from '../../assets/icons/outlined/search.svg';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (text: string) => void;
  onFilterPress?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'بحث',
  onSearch,
  onFilterPress,
}) => {
  const {isRTL} = useLanguage();
  const [searchText, setSearchText] = React.useState('');

  const handleSearch = (text: string) => {
    setSearchText(text);
    onSearch?.(text);
  };

  const inputStyle: TextStyle = {
    ...styles.searchInput,
    textAlign: isRTL ? 'right' : 'left',
    writingDirection: isRTL ? 'rtl' : 'ltr',
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={inputStyle}
          placeholder={placeholder}
          placeholderTextColor={Colors.gray}
          value={searchText}
          onChangeText={handleSearch}
        />
        <TouchableOpacity style={styles.searchIcon}>
          <SearchIcon width={20} height={20} color={Colors.gray} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.black,
    paddingVertical: 0,
  },
  searchIcon: {
    padding: 4,
  },
  searchIconText: {
    fontSize: 16,
  },
  filterButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
});
