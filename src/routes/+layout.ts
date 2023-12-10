import { loadTranslations } from '$lib/translation/config.js';

/** @type {import('@sveltejs/kit').Load} */
export const load = async ({ url }) => {
    const { pathname } = url;

    const initLocale = 'th'; // get from cookie, user session, ...

    await loadTranslations(initLocale, pathname); // keep this just before the `return`

    return {};
}