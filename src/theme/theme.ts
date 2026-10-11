export type AppTheme = {
  name: string;
  backgroundGradient: string[]; // برای LinearGradient
  colors: {
    userCardGradient: string[]; // برای LinearGradient
    headerBackground: string; // برای LinearGradient
    background: string;
    text: string;
    border: string;
    primary: string;
    secondary: string;
    card: string;
    textBackground: string;
    dropdownBackground: string;
    optionBackground: string;
    disabledBackground: string;
    disabledText: string;
    arrowColor: string;
    // اضافه بر اساس نیاز
  };
  fonts: {primary: string};
  iconStyle: 'light' | 'dark';
};

// 🔵 آبی ملایم — الگوی پایه‌ی همه‌ی تم‌ها. رنگ‌های تخت با الهام از فیسبوک:
// هدر = تخت‌ترین و عمیق‌ترین رنگ، بک‌گراند = همون رنگ ملایم‌تر،
// کارت = روشن‌تر (حس شناور بودن)، بوردر = پاستلی و روشن
const blueGradient: AppTheme = {
  name: 'آبی ملایم',
  backgroundGradient: ['#6E97F2', '#6E97F2'],
  colors: {
    userCardGradient: ['#ADC6F8', '#8FB0F5'],
    headerBackground: '#3D72E0',
    background: '#6E97F2',
    text: '#1E293B',
    border: '#D6E4FB',
    primary: '#2563EB',
    secondary: '#00F7FF',
    card: '#9DBBF7',
    textBackground: '#FFFFFF',
    dropdownBackground: '#F8FAFC',
    optionBackground: '#E2E8F0',
    disabledBackground: '#F1F5F9',
    disabledText: '#94A3B8',
    arrowColor: '#475569',
  },
  fonts: {primary: 'IRANSans'},
  iconStyle: 'dark',
};

// 🌌 سرمه‌ای — دارک‌مود ملایم با الهام از لینکدین/توییتر تیره
// کارت کمی روشن‌تر از بک‌گراند (قاعده‌ی متریال دارک = حس عمق و شناوری)
const navySolid: AppTheme = {
  name: 'سرمه‌ای',
  backgroundGradient: ['#22324A', '#22324A'],
  colors: {
    userCardGradient: ['#2C3F5C', '#1C2A40'],
    headerBackground: '#1C2A40',
    background: '#22324A',
    text: '#F1F5F9',
    border: '#46638C',
    primary: '#38BDF8',
    secondary: '#00F7FF',
    card: '#2C3F5C',
    textBackground: '#16223A',
    dropdownBackground: '#1C2A40',
    optionBackground: '#2C3F5C',
    disabledBackground: '#1C2A40',
    disabledText: '#64748B',
    arrowColor: '#CBD5E1',
  },
  fonts: {primary: 'IRANSans'},
  iconStyle: 'light',
};

// 🌊 فیروزه‌ای — تخت و خوش‌رنگ، الهام از تلگرام/توییتر
const tealBlueGradient: AppTheme = {
  name: 'فیروزه‌ای',
  backgroundGradient: ['#4FC2CB', '#4FC2CB'],
  colors: {
    userCardGradient: ['#8FE0E3', '#5FCBD1'],
    headerBackground: '#1E9AA8',
    background: '#4FC2CB',
    text: '#0F172A',
    border: '#D7F5F3',
    primary: '#0E8C9E',
    secondary: '#00F7FF',
    card: '#8FE0E3',
    textBackground: '#FFFFFF',
    dropdownBackground: '#FFFFFF',
    optionBackground: '#CCFBF1',
    disabledBackground: '#F1F5F9',
    disabledText: '#94A3B8',
    arrowColor: '#334155',
  },
  fonts: {primary: 'IRANSans'},
  iconStyle: 'dark',
};

// 🍑 هلویی — رنگ تخت کورال، مستقیم الهام‌گرفته از پالت تیندر
const peachGradient: AppTheme = {
  name: 'هلویی',
  backgroundGradient: ['#FF8F6E', '#FF8F6E'],
  colors: {
    userCardGradient: ['#FFC1AC', '#FF9C7D'],
    headerBackground: '#F2542D',
    background: '#FF8F6E',
    text: '#1E293B',
    border: '#FFE6DA',
    primary: '#FF5A36',
    secondary: '#00F7FF',
    card: '#FFC1AC',
    textBackground: '#FFFFFF',
    dropdownBackground: '#FFFFFF',
    optionBackground: '#FFEDD5',
    disabledBackground: '#F1F5F9',
    disabledText: '#94A3B8',
    arrowColor: '#334155',
  },
  fonts: {primary: 'IRANSans'},
  iconStyle: 'dark',
};

// 🌸 صورتی — مجنتا/صورتی تخت، حس اپ‌های دوستیابی مدرن (بامبل/اینستاگرام)
const pinkSolid: AppTheme = {
  name: 'صورتی',
  backgroundGradient: ['#F178B6', '#F178B6'],
  colors: {
    userCardGradient: ['#F9B7D9', '#F091C5'],
    headerBackground: '#D6498B',
    background: '#F178B6',
    text: '#1F2937',
    border: '#FDE3F0',
    primary: '#E0408C',
    secondary: '#00F7FF',
    card: '#F9B7D9',
    textBackground: '#FFFFFF',
    dropdownBackground: '#FFFFFF',
    optionBackground: '#FCE7F3',
    disabledBackground: '#F1F5F9',
    disabledText: '#9CA3AF',
    arrowColor: '#374151',
  },
  fonts: {primary: 'IRANSans'},
  iconStyle: 'dark',
};

// ☁️ روشن — خاکستری‌آبی تخت و آرام، کارت سفید خالص (حس بامبل/پیام‌رسان‌های روشن)
const lightTheme: AppTheme = {
  name: 'روشن',
  backgroundGradient: ['#EDEFF1', '#EDEFF1'],
  colors: {
    userCardGradient: ['#FFFFFF', '#E9ECEF'],
    headerBackground: '#7C8A93',
    background: '#EDEFF1',
    dropdownBackground: '#FFFFFF',
    arrowColor: '#5B7C99',
    text: '#263238',
    border: '#DDE3E8',
    primary: '#5B7C99',
    secondary: '#00F7FF',
    disabledBackground: '#F2F2F2',
    disabledText: '#9AA0A6',
    textBackground: '#FFFFFF',
    optionBackground: '#E3E7EA',
    card: '#FFFFFF',
  },
  fonts: {primary: 'IRANSans'},
  iconStyle: 'dark',
};

// 🌃 سرمه‌ای تیره — دارک‌مود واقعی (نزدیک به سیاه)، الهام از توییتر/دیسکورد تیره
const darkTheme: AppTheme = {
  name: 'سرمه‌ای تیره',
  backgroundGradient: ['#0D1526', '#0D1526'],
  colors: {
    userCardGradient: ['#16213A', '#0A0F1C'],
    headerBackground: '#0A0F1C',
    background: '#0D1526',
    textBackground: '#0A0F1C',
    dropdownBackground: '#0F1726',
    arrowColor: '#CBD5E1',
    text: '#E8EDF5',
    border: '#2C3B57',
    primary: '#3B82F6',
    secondary: '#00F7FF',
    disabledBackground: '#0F1726',
    disabledText: '#64748B',
    card: '#16213A',
    optionBackground: '#1C2940',
  },
  fonts: {primary: 'IRANSans'},
  iconStyle: 'light',
};

export const allThemes: AppTheme[] = [
  blueGradient,
  navySolid,
  tealBlueGradient,
  peachGradient,
  pinkSolid,
  lightTheme,
  darkTheme,
];
