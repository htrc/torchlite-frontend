'use client';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import qs from 'qs';

// types
import { DashboardContextProps, DashboardState, DashboardStatePatch, WorksetList } from 'types/torchlite';
import { useSession } from 'next-auth/react';
import { getAvailableDashboards, getAvailableWorksets, getDashboardState, updateDashboardState } from 'services';
import CustomBackdrop from 'components/Backdrop';

// initial state
const initialState: DashboardContextProps = {
  widgetState: {},
  widgetLoadingState: {},
  onChangeDashboardState: (e: DashboardStatePatch) => {},
  onChangeWidgetState: (e: any) => {},
  updateWidgetLoadingState: (widgetType: string, isLoaded: boolean) => {},
};
// ==============================|| CONFIG CONTEXT & PROVIDER ||============================== //

const AppContext = createContext(initialState);

type AppProviderProps = {
  children: ReactNode;
};

function AppProvider({ children }: AppProviderProps) {
  const [widgetState, setWidgetState] = useState<any>({});
  const [dashboardState, setDashboardState] = useState<DashboardState>();
  const [availableWorksets, setAvailableWorksets] = useState<WorksetList>();
  const [widgetLoadingState, setWidgetLoadingState] = useState<any>({});
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session, status } = useSession();

  const initializeWidgetLoadingState = (dashboardWidgets: any) => {
    const initialState: Record<string, boolean> = {};
    if (dashboardWidgets) {
      dashboardWidgets.forEach((widget: any) => {
        initialState[widget.type] = false; // Initialize each widget to 'not loaded' (false)
      });
    }
    setWidgetLoadingState(initialState);
  };

  useEffect(() => {
    const initApp = async () => {
      try {
        // Get workset and filter from router query
        const { worksetId } = router.query;
        const filters: any = qs.parse(router.query.filters as string, { comma: true });
        let selectedWorksetId: string,
          appliedFilters: any = {};

        // Get worksets
        let worksets: WorksetList = await getAvailableWorksets();
        if (worksets?.public) {
          worksets.public = worksets.public.filter((workset) => workset.numVolumes < 400)
        }
        if (worksets?.user) {
          worksets.user = worksets.user.filter((workset) => workset.numVolumes < 400)
        }
        setAvailableWorksets(worksets);

        // Get dashboard state
        const dashboardId = sessionStorage.getItem('dashboard_id');
        let dashboardState: DashboardState;
        if (status === 'unauthenticated') {
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

        if (worksetId) {
          selectedWorksetId = worksetId as string;
          if (filters) {
            for (const key in filters) {
              if (Object.prototype.hasOwnProperty.call(filters, key)) {
                if (key === 'pubDates') {
                  appliedFilters[key] = Array.isArray(filters[key])
                    ? filters[key].map((year: any) => parseInt(year, 10))
                    : [parseInt(filters[key], 10)];
                } else {
                  appliedFilters[key] = Array.isArray(filters[key]) ? filters[key] : [filters[key]];
                }
              }
            }
          }
          console.log("A");
          await updateDashboardState(dashboardState.id, {
            importedId: selectedWorksetId,
            filters: appliedFilters
          });
          dashboardState = await getDashboardState(dashboardState.id);
        } else {
          selectedWorksetId = dashboardState.importedId;
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
        setDashboardState(dashboardState);

        // Initialize widget loading state based on dashboard widgets
        if (dashboardState && dashboardState.widgets) {
          initializeWidgetLoadingState(dashboardState.widgets);
        }


      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (status !== 'loading') {
      initApp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (dashboardState) {
      const selectedWorksetId = dashboardState.worksetId;
      const appliedFilters = dashboardState.filters;
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          worksetId: selectedWorksetId,
          filters: qs.stringify(appliedFilters, { arrayFormat: 'comma', encode: false })
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname]);

  const updateWidgetLoadingState = (widgetType: string, isLoaded: boolean) => {
    setWidgetLoadingState((prevState: any) => {
      const updatedState = {
        ...prevState,
        [widgetType]: isLoaded,
      };
      return updatedState;
    });
  };

  const onChangeDashboardState = async (newDashboardState: DashboardStatePatch) => {
    try {
      if (dashboardState) {
        setLoading(true);
        console.log("B");
        await updateDashboardState(dashboardState.id, newDashboardState);
        const updatedState = await getDashboardState(dashboardState.id);
        setDashboardState(updatedState);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
        widgetLoadingState, // Pass widgetLoadingState to the context
        dashboardState,
        availableWorksets,
        onChangeDashboardState,
        onChangeWidgetState,
        updateWidgetLoadingState // Provide function to update widget loading state
      }}
    >
      <CustomBackdrop loading={loading} />
      {children}
    </AppContext.Provider>
  );
}

export { AppProvider, AppContext };
