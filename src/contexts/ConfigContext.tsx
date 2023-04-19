import { createContext, ReactNode } from 'react';

// project import
import defaultConfig from 'config';
import useLocalStorage from 'hooks/useLocalStorage';

// types
import { CustomizationProps, MenuOrientation, ThemeMode } from 'types/config';

// initial state
const initialState: CustomizationProps = {
  ...defaultConfig,
  onChangeMode: (mode: ThemeMode) => {},
  onChangeMiniDrawer: (miniDrawer: boolean) => {},
  onChangeMenuOrientation: (menuOrientation: MenuOrientation) => {},
};

// ==============================|| CONFIG CONTEXT & PROVIDER ||============================== //

const ConfigContext = createContext(initialState);

type ConfigProviderProps = {
  children: ReactNode;
};

function ConfigProvider({ children }: ConfigProviderProps) {
  const [config, setConfig] = useLocalStorage('mantis-react-next-ts-config', initialState);

  const onChangeMode = (mode: ThemeMode) => {
    setConfig({
      ...config,
      mode
    });
  };

  const onChangeMiniDrawer = (miniDrawer: boolean) => {
    setConfig({
      ...config,
      miniDrawer
    });
  };

  const onChangeMenuOrientation = (layout: MenuOrientation) => {
    setConfig({
      ...config,
      menuOrientation: layout
    });
  };

  return (
    <ConfigContext.Provider
      value={{
        ...config,
        onChangeMode,
        onChangeMiniDrawer,
        onChangeMenuOrientation
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export { ConfigProvider, ConfigContext };
