import {useRoute} from '@react-navigation/native';

export const useActiveTab = () => {
  const route = useRoute();

  switch (route.name) {
    case 'UserPanel':
      return 'home';
    case 'Messages':
      return 'messages';
    case 'Search':
      return 'search';
    case 'Interactions':
      return 'interactions';
    case 'HamburgerMenu':
      return 'menu';
    case 'Notifications':
      return 'notifications';
    case 'SupportList':
      return 'supportList';
    case 'Rules':
      return 'rules';
    case 'AiAssistant':
      return 'aiAssistant';
    default:
      return null;
  }
};
