// types
import { DefaultConfigProps } from 'types/config';

// ==============================|| THEME CONSTANT  ||============================== //

export const APP_DEFAULT_PATH = '/dashboard';
export const DRAWER_WIDTH = 360;

// ==============================|| THEME CONFIG  ||============================== //

const config: DefaultConfigProps = {
  fontFamily: `'Public Sans', sans-serif`,
  i18n: 'en',
  menuOrientation: 'vertical',
  miniDrawer: false,
  container: true,
  mode: 'light',
  presetColor: 'default',
  themeDirection: 'ltr'
};

export default config;
