import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './en.json';
import hi from './hi.json';
import mr from './mr.json';

export const LANGUAGE_KEY = 'app_language';

export const saveLanguage = async (lang) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  } catch (e) {
    console.log('Language save error:', e);
  }
};

export const loadLanguage = async () => {
  try {
    return await AsyncStorage.getItem(LANGUAGE_KEY) || 'en';
  } catch {
    return 'en';
  }
};

export const setAppLanguage = async (lang) => {
  try {
    await i18n.changeLanguage(lang);
    await saveLanguage(lang);
  } catch (e) {
    console.log('Error changing app language:', e);
  }
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    mr: { translation: mr },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  compatibilityJSON: 'v3',
});

loadLanguage().then((lang) => {
  i18n.changeLanguage(lang);
});

export default i18n;