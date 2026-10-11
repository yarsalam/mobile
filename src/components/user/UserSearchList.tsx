import React, { useMemo } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import HorizontalUserCard from '../HorizontalUserCard';
import GlobalText from '../GlobalText';
import { useFilter } from '../../context/FilterContext';
import { useFilterUsers } from '../../api/mutations/filters/useFilterUsers';
import { useExploreUsers } from '../../api/mutations/filters/useExploreUsers';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const UserSearchList = () => {
  const { filters } = useFilter();
  const { user: authUser } = useAuth();
  const navigation = useNavigation();

  const hasActiveFilters = Object.keys(filters).length > 0;

  const {
    data: filteredData,
    fetchNextPage: fetchNextFiltered,
    hasNextPage: hasNextFiltered,
    isFetchingNextPage: fetchingFiltered,
    isLoading: loadingFiltered,
  } = useFilterUsers(filters, { enabled: hasActiveFilters });

  const {
    data: exploreData,
    fetchNextPage: fetchNextExplore,
    hasNextPage: hasNextExplore,
    isFetchingNextPage: fetchingExplore,
    isLoading: loadingExplore,
  } = useExploreUsers(authUser?.id, { enabled: !hasActiveFilters });

  // Flat کردن صفحات و **فیلتر کردن آیتم‌های بدون id**
  const users = useMemo(() => {
    const raw = hasActiveFilters
      ? filteredData?.pages?.flat() || []
      : exploreData?.pages?.flat() || [];
    return raw.filter(item => item && typeof item.id === 'number');
  }, [hasActiveFilters, filteredData, exploreData]);

  const loadMore = () => {
    if (hasActiveFilters && hasNextFiltered && !fetchingFiltered) {
      fetchNextFiltered();
    } else if (!hasActiveFilters && hasNextExplore && !fetchingExplore) {
      fetchNextExplore();
    }
  };

  const renderItem = ({ item }: any) => {
    if (!item || !item.id) return null; // امنیت بیشتر
    return (
      <HorizontalUserCard
        user={item}
        onPress={() => navigation.navigate('UserProfile', { user: item.id })}
      />
    );
  };

  const isLoading = hasActiveFilters ? loadingFiltered : loadingExplore;

  return (
    <FlatList
      data={users}
      keyExtractor={(item, index) => item?.id?.toString() ?? index.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 12 }}
      onEndReached={loadMore}
      onEndReachedThreshold={0.3}
      ListFooterComponent={
        (hasActiveFilters ? fetchingFiltered : fetchingExplore) ? (
          <ActivityIndicator size="small" style={{ marginVertical: 10 }} />
        ) : null
      }
      ListEmptyComponent={
        !isLoading ? (
          <View style={styles.empty}>
            <GlobalText>کاربری یافت نشد</GlobalText>
          </View>
        ) : null
      }
    />
  );
};

const styles = StyleSheet.create({
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
});

export default UserSearchList;