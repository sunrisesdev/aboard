import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dev.sunrises.aboard',
  appName: 'aboard',
  webDir: 'public',
  server: {
    androidScheme: 'https'
  }
};

export default config;
