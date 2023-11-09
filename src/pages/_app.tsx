import { ReactElement, ReactNode, useEffect, useState } from 'react';

// scroll bar
import 'simplebar/src/simplebar.css';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';

// apex-chart
import 'styles/apex-chart.css';
import 'styles/react-table.css';

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
import CustomBackdrop from 'components/Backdrop';

import { env } from 'utils/utils';

// types
type LayoutProps = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface Props {
  Component: LayoutProps;
  pageProps: any;
}

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps & Props) {
  const [isLoading, setIsLoading] = useState(true);
  const getLayout = Component.getLayout ?? ((page: any) => page);
  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <CustomBackdrop loading={isLoading} />;
  }
  // console.log('BASE_API_URI: ', env('BASE_API_URI'));
  return (
    <ReduxProvider store={store}>
      <ConfigProvider>
        <ThemeCustomization>
          <Locales>
            <ScrollTop>
              <SessionProvider session={session} refetchInterval={0}>
                <>
                  <Notistack>
                    <Snackbar />
                    {getLayout(<Component {...pageProps} />)}
                    <div
                      id="tooltip"
                      style={{
                        position: 'absolute',
                        textAlign: 'left',
                        width: 'auto',
                        height: 'auto',
                        padding: '5px 10px',
                        font: '12px sans-serif',
                        background: 'lightsteelblue',
                        border: '0px',
                        borderRadius: '8px',
                        pointerEvents: 'none',
                        zIndex: '10',
                        opacity: '0'
                      }}
                    ></div>
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
