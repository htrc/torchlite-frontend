import { ReactElement } from 'react';

// next
import { NextPageContext } from 'next';
import NextLink from 'next/link';
import { getProviders, getCsrfToken } from 'next-auth/react';

// material-ui
import { Grid, Link, Stack, Typography } from '@mui/material';

// project import
import Layout from 'layout';
import Page from 'components/Page';
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthLogin from 'sections/auth/auth-forms/AuthLogin';
import { ArrowLeftOutlined } from '@ant-design/icons';

export default function SignIn({ providers, csrfToken }: any) {
  return (
    <Page title="Login">
      <AuthWrapper>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <NextLink href="/dashboard">
              <Link>
                <Stack direction="row" alignItems="center" sx={{ marginBottom: '1rem', cursor: 'pointer' }}>
                  <ArrowLeftOutlined style={{ paddingRight: '4px' }} rev={undefined} />
                  <Typography variant="h5">Back to Dashboard</Typography>
                </Stack>
              </Link>
            </NextLink>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
              <Typography variant="h3">Login</Typography>
              <NextLink href="/register" passHref>
                <Link variant="body1" color="primary">
                  Don&apos;t have an account?
                </Link>
              </NextLink>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <AuthLogin providers={providers} csrfToken={csrfToken} />
          </Grid>
        </Grid>
      </AuthWrapper>
    </Page>
  );
}

SignIn.getLayout = function getLayout(page: ReactElement) {
  return <Layout variant="auth">{page}</Layout>;
};

export async function getServerSideProps(context: NextPageContext) {
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);

  return {
    props: { providers, csrfToken }
  };
}
