import { useEffect } from 'react';

// next
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

// types
import { GuardProps } from 'types/auth';
import Loader from 'components/Loader';

// ==============================|| AUTH GUARD ||============================== //

const AuthGuard = ({ children }: GuardProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/auth/protected');
      const json = await res.json();
      if (!json.protected) {
        router.push({
          pathname: '/login',
          query: { from: router.asPath }
        });
      }
    };
    fetchData();

    // eslint-disable-next-line
  }, [session]);

  if (status === 'loading' || !session?.user) return <Loader />;

  return children;
};

export default AuthGuard;
