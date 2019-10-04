import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

import {basename} from './components/util/environment'

i18n
// load translation using xhr -> see /public/locales
  .use(Backend)
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  .init({
    fallbackLng: 'en',
    backend:{
      loadPath: `${basename}/locales/{{lng}}/{{ns}}.json`,

      // path to post missing resources
      addPath: `${basename}/locales/{{lng}}/{{ns}}`,
    },
    load:'languageOnly',
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    }
  });


export default i18n;