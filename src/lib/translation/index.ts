import enTranslation from '$lib/i18n/en/translation.json';
import thTranslation from '$lib/i18n/th/translation.json';
import i18n from 'sveltekit-i18n';

/** @type {import('sveltekit-i18n').Config} */
const config = {
    initLocale: 'th',
    translations: {
        en: {
            // title: 'test i18n'
            ...enTranslation
        },
        th: {
            // title: 'ห้วข้อ i18n'
            ...thTranslation
        }
    },
};

export const { t, l, locales, locale } = new i18n(config);