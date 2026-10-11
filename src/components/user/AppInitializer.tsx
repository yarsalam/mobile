import React, {useEffect} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {useCheckAuthOrRegisterStep} from '../../lib/useCheckAuthOrRegisterStep';
import {useAuth} from '../../context/AuthContext';
import InnerApp from './InnerApp';
// import {useNotificationSocket} from '../lib/useNotificationSocket';
// import notifee, {AndroidImportance} from '@notifee/react-native';

export const AppInitializer = () => {
  const {isAuthenticated, isAuthLoading} = useAuth();
  const {hasChecked, initialRoute} = useCheckAuthOrRegisterStep();
  // useNotificationSocket();
  // useEffect(() => {
  //   async function createChannel() {
  //     await notifee.createChannel({
  //       id: 'default',
  //       name: 'اعلان‌های یارسلام',
  //       importance: AndroidImportance.HIGH,
  //     });
  //   }
  //   createChannel();
  // }, []);

  if (isAuthLoading || !hasChecked) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  const route = isAuthenticated ? 'UserPanel' : initialRoute;

  return <InnerApp initialRoute={route} />;
};
