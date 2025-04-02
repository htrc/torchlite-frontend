'use client';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import qs from 'qs';

// types
import { DashboardContextProps, DashboardState, DashboardStatePatch, WorksetList } from 'types/torchlite';
import { useSession } from 'next-auth/react';
import { getAvailableDashboards, getAvailableWorksets, getDashboardState, updateDashboardState } from 'services';
import CustomBackdrop from 'components/Backdrop';
import AlertDialog from 'components/AlertDialog';

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
  const [errorAlert, setErrorAlert] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
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
            try {
              dashboardState = await getDashboardState(dashboardId);
            } catch (err) {
              console.error(`Error loading available dashboards while unauthenticated: ${err}`);
              setErrorAlert(true);
              setErrorText('The workset you are trying to access had been deleted or been made private. Contact the workset owner to check the workset status. Worksets must me public in order to have access to it in the dashboard.');
              console.log(`dashboard id: ${dashboardId}`)
              dashboardState = { id: (dashboardId ? dashboardId : ""), worksetId: "", filters: {}, widgets: [], isShared: true, importedId: "", worksetInfo: { id: "", name: "", author: "", isPublic: true, numVolumes: 0, volumes: []} }
            }
          } else {
            try {
              const dashboards = await getAvailableDashboards();
              dashboardState = dashboards[0];
            } catch (err) {
              console.error(`Error loading available worksets while unauthenticated: ${err}`);
              console.log(JSON.stringify(err))
              setErrorAlert(true);
              setErrorText('Worksets are currently unavailable, please try again later.')
              dashboardState = { id: (dashboardId ? dashboardId : ""), worksetId: "", filters: {}, widgets: [], isShared: true, importedId: "", worksetInfo: { id: "", name: "", author: "", isPublic: true, numVolumes: 0, volumes: []} }
            }
          }

          sessionStorage.setItem('dashboard_id', dashboardState.id);
        } else {
          try {
            const dashboards = await getAvailableDashboards(dashboardId);
            dashboardState = dashboards[0];
          } catch (err) {
            console.error(`Error loading available dashboards while authenticated: ${err}`);
            setErrorAlert(true);
            setErrorText('The workset you are trying to access had been deleted or been made private. Contact the workset owner to check the workset status. Worksets must me public in order to have access to it in the dashboard.');
            console.log(`dashboard id: ${dashboardId}`)
            dashboardState = { id: (dashboardId ? dashboardId : ""), worksetId: "", filters: {}, widgets: [], isShared: true, importedId: "", worksetInfo: { id: "", name: "", author: "", isPublic: true, numVolumes: 0, volumes: []} }
          }

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
          try {
            await updateDashboardState(dashboardState.id, {
              importedId: selectedWorksetId,
              filters: appliedFilters
            });
          } catch (err) {
            console.error(`Error loading workset from URL: ${err}`);
            setErrorAlert(true);
            setErrorText('This dashboard’s workset is private. Contact the workset’s owner to make the workset is public to see their dashboard.');
            console.log(`workset id: ${selectedWorksetId}`)
          }
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
        console.log('running onChangeDashboardState')
        console.log(dashboardState.id)
        console.log(newDashboardState)
        await updateDashboardState(dashboardState.id, newDashboardState);
        const updatedState = await getDashboardState(dashboardState.id);
        setDashboardState(updatedState);
      }
    } catch (error) {
      console.log("ERROR RUNNING onChangeDashboardState")
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
      {!loading && errorAlert ? 
        <AlertDialog 
          message={errorText} 
        /> : <></>
      }
      {children}
    </AppContext.Provider>
  );
}

export { AppProvider, AppContext };
