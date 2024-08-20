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
  const [availableWorksets, setAvailableWorksets] = useState<WorksetList>();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session, status } = useSession();

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
        console.log("USER EMAIL");
        console.log(session?.user?.email);
        console.log("PUBLIC WORKSETS");
        console.log(availableWorksets?.public);
        console.log("STATUS");
        console.log(status);
        if (status === 'authenticated' && session.user.email && availableWorksets?.public) {
          const workset_creator = session.user.email.substring(0,session.user.email?.indexOf('@'))
          console.log("WORKSET CREATOR");
          console.log(workset_creator);
          worksets.user = availableWorksets.public.filter((workset) => workset.author == workset_creator)
          console.log("USER WORKSETS");
          console.log(worksets.user);
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

  const onChangeDashboardState = async (newDashboardState: DashboardStatePatch) => {
    try {
      if (dashboardState) {
        setLoading(true);
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
