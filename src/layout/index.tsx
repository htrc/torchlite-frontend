import { ReactElement } from 'react';

// material-ui
import { LinearProgressProps } from '@mui/material/LinearProgress';

import MainLayout from './MainLayout';
import AuthGuard from 'utils/route-guard/AuthGuard';

export interface LoaderProps extends LinearProgressProps {}

// ==============================|| LAYOUTS - STRUCTURE ||============================== //

interface Props {
  children: ReactElement;
  variant?: 'main' | 'blank' | 'landing' | 'simple' | 'component';
}

export default function Layout({ variant = 'main', children }: Props) {
  if (variant === 'blank') {
    return children;
  }

  if (variant === 'main') {
    return <MainLayout>{children}</MainLayout>;
  }

  return (
    <AuthGuard>
      <MainLayout>{children}</MainLayout>
    </AuthGuard>
  );
}
