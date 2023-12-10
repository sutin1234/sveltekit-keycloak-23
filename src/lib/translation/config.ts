import i18n from 'sveltekit-i18n';

const config = ({
    loaders: [
        {
            locale: 'en',
            key: 'common',
            loader: async () => (
                await import('$lib/i18n/en/translation.json')
            ).default,
        },
        {
            locale: 'th',
            key: 'common',
            routes: ['/'],
            loader: async () => (
                await import('$lib/i18n/th/translation.json')
            ).default,
        },
    ]
})
export const { t, locale, locales, loading, loadTranslations } = new i18n(config);