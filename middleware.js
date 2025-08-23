import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing, {
  localeDetection: false // always use defaultLocale for bare paths
});

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)']
};
