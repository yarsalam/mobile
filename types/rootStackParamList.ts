export type RootStackParamList = {
  Login: {error?: string};
  Register: undefined;
  SelectChannel: undefined;
  sendOtpWithChannel: undefined;
  EmptyState: undefined;
  TelegramActivation: undefined;
  WhatsAppActivation: undefined;
  Welcome: undefined;
  Products:
    | {
        /** FeedItem.id for the promotion that opened the product catalog. */
        promotionId?: string;
        promotionVariant?: 'boost' | 'vip' | 'credit' | 'profile' | 'bundle';
      }
    | undefined;
  multiStepProfile: undefined;
  UserPanel: undefined;
  EditImg: undefined;
  WebViewScreen: {url: string};
  HamburgerMenu: {isDarkMode: boolean};
  Messages: undefined;
  Search: undefined;
  Interactions: undefined;
  UserProfile: {user?: any} | undefined;
  EditUserProfile: undefined;
  ChangeUserPassword: undefined;
  ChangeUserMobile: undefined;
  Transactions: undefined;
  Basket: undefined;
  Settings: undefined;
  DisplaySettings: undefined;
  Chat: {userId: number; nickname: string};
  SupportList: undefined;
  CreateTicket: undefined;
  TicketDetail: {ticketId: number};
  Rules: undefined;
  Filter: undefined;
  AiAssistant: undefined;
  AiChat: {convId: number};
  AiAdvice: undefined;
  FaceVerification: undefined;
  AccountActions: undefined;
  Notifications: undefined;
  PaymentMethod: {productId: string};
  Deposit: {
    /** Integer Iranian rials, matching ProductBundle.price in the API. */
    amountRials: number;
    productLabel: string;
    bundleCode?: string;
  };
};
