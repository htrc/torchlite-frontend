import { createContext, ReactNode, useEffect, useState } from 'react';

// project import
import defaultConfig from 'config';
import useLocalStorage from 'hooks/useLocalStorage';

// types
import { CustomizationProps, MenuOrientation, ThemeMode } from 'types/config';
import { DashboardContextProps, DashboardState } from 'types/torchlite';
import { useSession } from 'next-auth/react';
import { getAvailableDashboards, getDashboardState } from 'services';

// initial state
const initialState: DashboardContextProps = {
  onChangeMode: () => {},
  onChangeMiniDrawer: () => {},
  onChangeMenuOrientation: () => {}
};

// ==============================|| CONFIG CONTEXT & PROVIDER ||============================== //

const AppContext = createContext(initialState);

type AppProviderProps = {
  children: ReactNode;
};

function AppProvider({ children }: AppProviderProps) {
  // const [config, setConfig] = useLocalStorage('mantis-react-next-ts-config', initialState);
  const [dashboardState, setDashboardState] = useState<DashboardState>();
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session } = useSession();

  useEffect(() => {
    const initApp = async () => {
      try {
        // Get dashboard state
        const dashboardId = localStorage.getItem('dashboard_id');
        let dashboardState: DashboardState;

        if (!session) {
          if (dashboardId) {
            dashboardState = await getDashboardState(dashboardId);
          } else {
            const dashboards = await getAvailableDashboards();
            dashboardState = dashboards[0];
          }

          localStorage.setItem('dashboard_id', dashboardState.id);
        } else {
          const dashboards = await getAvailableDashboards(dashboardId);
          dashboardState = dashboards[0];

          if (dashboardId) {
            localStorage.removeItem('dashboard_id');
          }
        }
        console.log('dashboard state', dashboardState);
        setDashboardState(dashboardState);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, []);

  const onChangeMode = () => {
  };

  const onChangeMiniDrawer = () => {
  };

  const onChangeMenuOrientation = () => {
  };

  return (
    <AppContext.Provider
      value={{
        dashboardState,
        onChangeMode,
        onChangeMiniDrawer,
        onChangeMenuOrientation
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export { AppProvider, AppContext };
