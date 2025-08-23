import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

// next-intl looks for this file automatically.
// It provides the active locale + messages for server utilities like getTranslations().
export default getRequestConfig(async ({requestLocale}) => {
  let locale = requestLocale;

  // Fallback to default if the incoming locale isn't supported
  if (!routing.locales.includes(locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
