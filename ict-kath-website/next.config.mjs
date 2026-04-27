// ----------------------------------------------------------------------

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,

 // ✅ ADD HERE
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  swcMinify: true,
  productionBrowserSourceMaps: false,

  env: {
    // DEV_API: 'http://localhost:3000',
    // PRODUCTION_API: 'http://localhost:3000',
    DEV_API: 'https://prod-api-v2.ictkathurusingha.com',
    PRODUCTION_API: 'https://prod-api-v2.ictkathurusingha.com',
    G_STORAGE: 'https://storage.googleapis.com/ict-kath-bucket/',
    GOOGLE_API: '',
    STUDENT_APP_BASE_URL: 'https://student.ictkathurusingha.com/',
    // STUDENT_APP_BASE_URL: 'http://localhost:4000/',
  },
  images: {
    domains: [],
  },
  // i18n: {
  //   defaultLocale: 'en',
  //   locales: ['en', 'sn'],
  // },
};

export default nextConfig;
