import { ReactElement, ReactNode } from 'react';

// scroll bar
import 'simplebar/src/simplebar.css';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';

// apex-chart
import 'styles/apex-chart.css';
import 'styles/react-table.css';
import 'styles/chart-widget.css';

// next
import { NextPage } from 'next';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';

// third party
import { Provider as ReduxProvider } from 'react-redux';

// project import
import Locales from 'components/Locales';
import ScrollTop from 'components/ScrollTop';
import Snackbar from 'components/@extended/Snackbar';
import { ConfigProvider } from 'contexts/ConfigContext';
import { store } from 'store';
import ThemeCustomization from 'themes';
import Notistack from 'components/third-party/Notistack';

// types
type LayoutProps = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface Props {
  Component: LayoutProps;
  pageProps: any;
}

export default function App({ Component, pageProps }: AppProps & Props) {
  const getLayout = Component.getLayout ?? ((page: any) => page);

  return (
    <ReduxProvider store={store}>
      <ConfigProvider>
        <ThemeCustomization>
          <Locales>
            <ScrollTop>
              <SessionProvider session={pageProps.session} refetchInterval={0}>
                <>
                  <Notistack>
                    <Snackbar />
                    {getLayout(<Component {...pageProps} />)}
                  </Notistack>
                </>
              </SessionProvider>
            </ScrollTop>
          </Locales>
        </ThemeCustomization>
      </ConfigProvider>
    </ReduxProvider>
  );
}
