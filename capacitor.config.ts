import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.moneymint.app',
  appName: 'MoneyMint',
  webDir: 'capacitor_assets',
  server: {
    url: 'https://moneymint.vercel.app/',
    androidScheme: 'https'
  }
};

export default config;
