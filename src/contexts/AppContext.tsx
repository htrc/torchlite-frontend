import { createContext, ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import qs from 'qs';

// types
import { DashboardContextProps, DashboardState, DashboardStatePatch, WorksetSummary } from 'types/torchlite';
import { useSession } from 'next-auth/react';
import { getAvailableDashboards, getAvailableWorksets, getDashboardState, updateDashboardState } from 'services';
import CustomBackdrop from 'components/Backdrop';

// initial state
const initialState: DashboardContextProps = {
  widgetState: {},
  onChangeDashboardState: (e: DashboardStatePatch) => {},
  onChangeWidgetState: (e: any) => {}
};

// ==============================|| CONFIG CONTEXT & PROVIDER ||============================== //

const AppContext = createContext(initialState);

type AppProviderProps = {
  children: ReactNode;
};

function AppProvider({ children }: AppProviderProps) {
  const [widgetState, setWidgetState] = useState<any>({});
  const [dashboardState, setDashboardState] = useState<DashboardState>();
  const [availableWorksets, setAvailableWorksets] = useState<WorksetSummary[]>();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session } = useSession();

  useEffect(() => {
    const initApp = async () => {
      try {
        // Get workset and filter from router query
        const { worksetId } = router.query;
        const filters = qs.parse(router.query.filters as string, { comma: true });
        let selectedWorksetId: string, appliedFilters;

        // Get worksets
        const worksets: WorksetSummary[] = await getAvailableWorksets();
        setAvailableWorksets(worksets);

        // Get dashboard state
        const dashboardId = sessionStorage.getItem('dashboard_id');
        let dashboardState: DashboardState;

        console.log('dashboardId', dashboardId);
        if (!session) {
          if (dashboardId) {
            dashboardState = await getDashboardState(dashboardId);
          } else {
            const dashboards = await getAvailableDashboards();
            dashboardState = dashboards[0];
          }

          sessionStorage.setItem('dashboard_id', dashboardState.id);
        } else {
          const dashboards = await getAvailableDashboards(dashboardId);
          dashboardState = dashboards[0];

          if (dashboardId) {
            sessionStorage.removeItem('dashboard_id');
          }
        }
        console.log('dashboard state', dashboardState);
        setDashboardState(dashboardState);

        if (worksetId) {
          selectedWorksetId = worksetId as string;
          appliedFilters = filters;
        } else {
          selectedWorksetId = dashboardState.worksetId;
          appliedFilters = dashboardState.filters;
          router.push({
            pathname: router.pathname,
            query: {
              ...router.query,
              worksetId: selectedWorksetId,
              filters: qs.stringify(appliedFilters, { arrayFormat: 'comma', encode: false })
            }
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, []);

  const onChangeDashboardState = async (newDashboardState: DashboardStatePatch) => {
    try {
      if (dashboardState) {
        setLoading(true);
        await updateDashboardState(dashboardState.id, newDashboardState);
        const updatedState = await getDashboardState(dashboardState.id);
        setDashboardState(updatedState);
        console.log(updatedState);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /*
  const newWidgetState = {
    widgetType: 'Map',
    minYear: 2019,
    maxYear: 2023,
    data: [...]
  }
  */
  const onChangeWidgetState = (newWidgetState: any) => {
    setWidgetState({
      ...widgetState,
      [newWidgetState.widgetType]: {
        ...newWidgetState
      }
    });
  };

  return (
    <AppContext.Provider
      value={{
        widgetState,
        dashboardState,
        availableWorksets,
        onChangeDashboardState,
        onChangeWidgetState
      }}
    >
      <CustomBackdrop loading={loading} />
      {children}
    </AppContext.Provider>
  );
}

export { AppProvider, AppContext };
