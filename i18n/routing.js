// i18n/routing.js
import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

// 1) Your routing config
export const routing = defineRouting({
  locales: ['ar', 'en'],
  defaultLocale: 'ar',
  // 'as-needed' => no /ar prefix for defaultLocale, prefixes others
  localePrefix: 'as-needed'
});

// 2) Export Link / useRouter / usePathname as NAMED exports
export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);

