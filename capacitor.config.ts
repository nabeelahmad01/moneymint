import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.moneymint.app',
  appName: 'MoneyMint',
  webDir: 'public',
  server: {
    url: 'https://moneymint.vercel.app/',
    androidScheme: 'https'
  }
};

export default config;
