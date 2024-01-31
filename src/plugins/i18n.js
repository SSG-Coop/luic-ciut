// © Copyright 2023, LUIC-CIUT's Contributors
import { createI18n } from 'vue-i18n'
import en from '@/locales/en';
import fr from '@/locales/fr';

export default createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    globalInjection: true,
    warnHtmlMessage: false,
    messages: {
        en,
        fr,
    }
})