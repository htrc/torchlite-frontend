import { ReactElement, useEffect } from 'react';
import { useRouter } from 'next/router';

// ==============================|| NAVIGATION - SCROLL TO TOP ||============================== //

const ScrollTop = ({ children }: { children: ReactElement | null }) => {
  const location = useRouter();
  const { asPath } = location;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [asPath]);

  return children || null;
};

export default ScrollTop;
