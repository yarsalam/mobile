import React, {useState} from 'react';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../context/MainContext';
import ProfileDrawer from './ProfileDrawer';
import {useActiveTab} from '../lib/useActiveTab';
import {useImageContext} from '../context/ImageContext';
import {useAuth} from '../context/AuthContext';
import {getUserAvatarSource} from '../utils/imageUtils';
import GlobalText from './GlobalText';
import {useFilter} from '../context/FilterContext';
import {useGuidance} from '../api/mutations/assistant/aiAssistantHooks';
import {useNotificationBadges} from '../api/mutations/notifications/useNotifications';
import WalletBadge from './CardPaymentSheet/WalletBadge';

const Header: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const activeTab = useActiveTab();
  const {mainImage} = useImageContext();
  const {user} = useAuth();
  const {theme} = useTheme();
  const styles = getStyles(theme);
  const {activeFilterCount} = useFilter();
  const avatarSource = getUserAvatarSource({
    avatarUrl: mainImage?.url,
    gender: user?.gender,
  });

  const {data: badges} = useNotificationBadges();
  const interactionCount = badges?.interactions || 0;
  const systemCount = badges?.system || 0;
  const unreadCount = badges?.messages || 0;

  const icons = {
    contact: require('../assets/img/cont.png'),
    rules: require('../assets/img/rul.png'),
    home: require('../assets/img/home.png'),
    menu: require('../assets/img/menu.png'),
    interactions: require('../assets/img/interactions.png'),
    search: require('../assets/img/search.png'),
    messages: require('../assets/img/messages.png'),
    notification: require('../assets/img/noti.png'),
    avatar: require('../assets/img/man_avt.png'),
    logo: require('../assets/img/yarsalam.png'),
    assistant: require('../assets/img/assistant.png'),
  };
  const activeColor = theme.colors.secondary || '#ff5bfa';
  const {data: guidanceData} = useGuidance();
  const showGuidanceBadge = guidanceData?.hasGuidance === true;

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <View style={styles.topMenu}>
        <Image source={icons.logo} style={styles.logo} />
        <View style={styles.topIcons}>
<TouchableOpacity 
  onPress={() => {
    console.log('Route names:', navigation.getState()?.routeNames);
    navigation.navigate('Products' as never);
  }}>
  <WalletBadge />
</TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('AiAssistant' as never)}
            style={{position: 'relative'}}>
            <Image
              source={icons.assistant}
              style={[
                styles.icon,
                activeTab === 'aiAssistant' && {tintColor: activeColor},
              ]}
            />
            {showGuidanceBadge && (
              <View style={styles.badge}>
                <GlobalText style={styles.badgeText}>!</GlobalText>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('SupportList' as never)}>
            <Image
              source={icons.contact}
              style={[
                styles.icon,
                activeTab === 'supportList' && {tintColor: activeColor},
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications' as never)}>
            <View style={{alignItems: 'center', position: 'relative'}}>
              <Image
                source={icons.notification}
                style={[
                  styles.bottomIcon,
                  activeTab === 'notifications' && {tintColor: activeColor},
                ]}
              />
              {activeTab === 'notifications' && (
                <View style={styles.underline} />
              )}
              {systemCount > 0 && (
                <View style={styles.badge}>
                  <GlobalText style={styles.badgeText}>
                    {systemCount > 99 ? '99+' : systemCount}
                  </GlobalText>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomMenu}>
        <TouchableOpacity
          onPress={() => navigation.navigate('HamburgerMenu' as never)}>
          <View style={{alignItems: 'center'}}>
            <Image
              source={icons.menu}
              style={[
                styles.menuIcon,
                activeTab === 'menu' && {tintColor: activeColor},
              ]}
            />
            {activeTab === 'menu' && <View style={styles.underline} />}
          </View>
        </TouchableOpacity>

        <View style={styles.centerIcons}>
          {/* 🔔 Interactions — like, superlike, match, visitor */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Interactions' as never)}>
            <View style={{alignItems: 'center'}}>
              <Image
                source={icons.interactions}
                style={[
                  styles.bottomIcon,
                  activeTab === 'interactions' && {tintColor: activeColor},
                ]}
              />
              {activeTab === 'interactions' && (
                <View style={styles.underline} />
              )}
              {interactionCount > 0 && (
                <View style={styles.badge}>
                  <GlobalText style={styles.badgeText}>
                    {interactionCount > 99 ? '99+' : interactionCount}
                  </GlobalText>
                </View>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Search' as never)}>
            <View style={{position: 'relative'}}>
              <Image
                source={icons.search}
                style={[
                  styles.icon,
                  activeTab === 'search' && {tintColor: activeColor},
                ]}
              />
              {activeTab === 'search' && <View style={styles.underline} />}
              {(activeFilterCount || 0) > 0 && (
                <View style={styles.badge}>
                  <GlobalText style={styles.badgeText}>
                    {activeFilterCount}
                  </GlobalText>
                </View>
              )}
            </View>
          </TouchableOpacity>

          {/* 💬 Messages — unread count */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Messages' as never)}>
            <View style={{alignItems: 'center'}}>
              <Image
                source={icons.messages}
                style={[
                  styles.bottomIcon,
                  activeTab === 'messages' && {tintColor: activeColor},
                ]}
              />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <GlobalText style={styles.badgeText}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </GlobalText>
                </View>
              )}
              {activeTab === 'messages' && <View style={styles.underline} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('UserPanel' as never)}>
            <View style={{alignItems: 'center'}}>
              <Image
                source={icons.home}
                style={[
                  styles.bottomIcon,
                  activeTab === 'home' && {tintColor: activeColor},
                ]}
              />
              {activeTab === 'home' && <View style={styles.underline} />}
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => setIsDrawerOpen(!isDrawerOpen)}>
          <Image
            source={avatarSource}
            style={styles.profileImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>

      <ProfileDrawer
        isVisible={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    badge: {
      position: 'absolute',
      top: -7,
      left: -7,
      backgroundColor: 'red',
      borderRadius: 9,
      width: 18,
      height: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
    badgeText: {
      color: 'white',
      fontSize: 11,
      fontWeight: 'bold',
    },
    underline: {
      position: 'absolute',
      bottom: -15,
      height: 4.1,
      width: 46,
      backgroundColor: theme.colors.secondary,
      borderRadius: 2,
    },
    container: {
      width: '100%',
      paddingBottom: 10,
      marginBottom: 15,
      borderWidth: 0.3,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      elevation: 0.6,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 5,
      shadowOffset: {width: 0, height: 1},
      backgroundColor: theme.colors.headerBackground,
      borderRadius: 5,
    },
    topMenu: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 5,
      paddingVertical: 15,
      marginBottom: 10,
    },
    logo: {
      width: 150,
      height: 35,
      resizeMode: 'contain',
    },
    topIcons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    icon: {
      width: 31,
      height: 31,
      resizeMode: 'contain',
    },
    bottomMenu: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 8,
      paddingVertical: 1,
    },
    centerIcons: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'flex-end',
      paddingHorizontal: 10,
    },
    bottomIcon: {
      width: 32,
      height: 32,
      resizeMode: 'contain',
    },
    menuIcon: {
      width: 30,
      height: 30,
      resizeMode: 'contain',
    },
    profileImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: '#fff',
    },
  });

export default Header;
