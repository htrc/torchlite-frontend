import { useEffect } from 'react';

// next
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

// project import
import { APP_DEFAULT_PATH } from 'config';

// types
import { GuardProps } from 'types/auth';
import Loader from 'components/Loader';

// ==============================|| GUEST GUARD ||============================== //

const GuestGuard = ({ children }: GuardProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/auth/protected');
      const json = await res.json();
      if (json.protected) {
        let RedirectPath = router.query.from ? router.query.from : APP_DEFAULT_PATH;
        router.push({
          pathname: RedirectPath as string,
          query: {}
        });
      }
    };
    fetchData();

    // eslint-disable-next-line
  }, [session]);

  if (status === 'loading' || session?.user) return <Loader />;

  return children;
};

export default GuestGuard;
