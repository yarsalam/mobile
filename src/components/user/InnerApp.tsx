import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import UserPanel from '../../pages/UserPanel';
import HamburgerMenu from '../HamburgerMenu';
import {RootStackParamList} from '../../../types/rootStackParamList';
import Welcome from '../../pages/auth/Welcome';
import Register from '../../pages/auth/Register';
import Login from '../../pages/auth/Login';
import {useAuth} from '../../context/AuthContext';
import Messages from '../../pages/messages/Messages';
import Interactions from '../../pages/Interactions';
import UserProfile from '../../pages/UserProfile';
import EditUserProfile from '../../pages/EditUserProfile';
import Transactions from '../../pages/transaction/Transactions';
import Products from '../../pages/Products';
import Basket from '../../pages/payment/Basket';
import MultiStepProfile from '../../pages/auth/MultiStepProfile';
import TelegramActivation from '../../pages/auth/TelegramActivation';
import SelectChannel from '../../pages/auth/SelectChannel';
import WhatsAppActivation from '../../pages/auth/WhatsAppActivation';
import SettingsScreen from '../../pages/SettingsScreen';
import DisplaySettingsScreen from '../../pages/DisplaySettingsScreen';
import ChatScreen from '../../pages/messages/ChatScreen';
import SupportListScreen from '../../pages/tickets/SupportListScreen';
import CreateTicketScreen from '../../pages/tickets/CreateTicketScreen';
import TicketDetailScreen from '../../pages/tickets/TicketDetailScreen';
import RulesScreen from '../../pages/RulesScreen';
import FilterScreen from '../../pages/filter/FilterScreen';
import Search from '../../pages/filter/Search';
import AiAssistantMain from '../../pages/assistant/AiAssistantMain';
import AiChat from '../../pages/assistant/AiChat';
import AiAdvice from '../../pages/assistant/AiAdvice';
import EditImg from '../../pages/images/EditImg';
import VerificationScreen from '../../pages/images/VerificationScreen';
import AccountActionsScreen from '../../pages/AccountActionsScreen';
import NotificationsScreen from '../../pages/NotificationsScreen';
import ChangeUserMobile from '../../pages/editMobile/ChangeUserMobile';
import ChangeUserPassword from '../../pages/ChangeUserPassword';
import PaymentMethod from '../../pages/payment/PaymentMethod';
import DepositScreen from '../../pages/payment/DepositScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const InnerApp = ({initialRoute}: {initialRoute: keyof RootStackParamList}) => {
  const {isAuthenticated, isAuthLoading} = useAuth();
  if (isAuthLoading) return null;
  const safeRoute =
    !isAuthenticated && initialRoute === 'UserPanel' ? 'Login' : initialRoute;
  return (
    <Stack.Navigator
      key={isAuthenticated ? 'auth' : 'guest'}
      screenOptions={{headerShown: false}}
      initialRouteName={safeRoute}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="UserPanel" component={UserPanel} />
          <Stack.Screen name="Products" component={Products} />
          <Stack.Screen name="EditImg" component={EditImg} />
          <Stack.Screen name="UserProfile" component={UserProfile} />
          <Stack.Screen name="EditUserProfile" component={EditUserProfile} />
          <Stack.Screen name="HamburgerMenu" component={HamburgerMenu} />
          <Stack.Screen name="Messages" component={Messages} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="Interactions" component={Interactions} />
          <Stack.Screen name="Transactions" component={Transactions} />
          <Stack.Screen name="Basket" component={Basket} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Deposit" component={DepositScreen} />
          <Stack.Screen
            name="ChangeUserPassword"
            component={ChangeUserPassword}
          />
          <Stack.Screen name="ChangeUserMobile" component={ChangeUserMobile} />
          <Stack.Screen
            name="FaceVerification"
            component={VerificationScreen}
          />
          <Stack.Screen
            name="AccountActions"
            component={AccountActionsScreen}
          />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen
            name="Filter"
            component={FilterScreen}
            options={{animation: 'slide_from_right'}}
          />
          <Stack.Screen
            name="DisplaySettings"
            component={DisplaySettingsScreen}
          />
          <Stack.Screen name="SupportList" component={SupportListScreen} />
          <Stack.Screen name="CreateTicket" component={CreateTicketScreen} />
          <Stack.Screen name="TicketDetail" component={TicketDetailScreen} />
          <Stack.Screen name="Rules" component={RulesScreen} />
          <Stack.Screen name="AiAssistant" component={AiAssistantMain} />
          <Stack.Screen name="AiChat" component={AiChat} />
          <Stack.Screen name="AiAdvice" component={AiAdvice} />
          <Stack.Screen
            name="PaymentMethod"
            component={PaymentMethod}
            options={{headerShown: false}}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="multiStepProfile" component={MultiStepProfile} />
          <Stack.Screen name="SelectChannel" component={SelectChannel} />
          <Stack.Screen
            name="TelegramActivation"
            component={TelegramActivation}
          />
          <Stack.Screen
            name="WhatsAppActivation"
            component={WhatsAppActivation}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default InnerApp;
