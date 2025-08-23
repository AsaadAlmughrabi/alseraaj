import createNextIntlPlugin from 'next-intl/plugin';

// Point to your request config (JS project)
const withNextIntl = createNextIntlPlugin('./i18n/request.js');

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withNextIntl(nextConfig);
