import { ReactNode, useEffect, useState, ReactElement } from 'react';

// third-party
import { IntlProvider, MessageFormatElement } from 'react-intl';

// project import
import useConfig from 'hooks/useConfig';
import { I18n } from 'types/config';

// helper for react 18 overload
const MyIntlProvider: any = IntlProvider;

// load locales files
const loadLocaleData = (locale: I18n) => {
  return import('utils/locales/en.json');
};

// ==============================|| LOCALIZATION ||============================== //

interface Props {
  children: ReactNode;
}

const Locales = ({ children }: Props) => {
  const { i18n } = useConfig();

  const [messages, setMessages] = useState<Record<string, string> | Record<string, MessageFormatElement[]> | undefined>();

  useEffect(() => {
    loadLocaleData(i18n).then((d: { default: Record<string, string> | Record<string, MessageFormatElement[]> | undefined }) => {
      setMessages(d.default);
    });
  }, [i18n]);

  return (
    <>
      {messages && (
        <MyIntlProvider locale={i18n} defaultLocale="en" messages={messages}>
          {children as ReactElement}
        </MyIntlProvider>
      )}
    </>
  );
};

export default Locales;
