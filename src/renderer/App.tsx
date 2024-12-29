import './App.css';
import '@fontsource-variable/rubik';

import {
  QueryErrorResetBoundary,
  QueryClientProvider,
} from '@tanstack/react-query';
import { Button } from '@mui/material';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';
import { Box, ThemeProvider } from '@mui/system';

import Logo from './components/Logo';
import Loading from './components/Loading';

import theme from './theme';
import Typography from './components/Typography';
import { useDownloadPath } from './queries';
import Applications from './components/Applications';
import ChooseDirectory from './components/ChooseDirectory';
import { queryClient } from './query-client';
import AppContainer from './components/AppContainer';

function Layout() {
  const downloadPath = useDownloadPath();
  return downloadPath ? <Applications /> : <ChooseDirectory />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ThemeProvider theme={theme}>
        <Box
          sx={{ backgroundColor: 'primary.main' }}
          display="flex"
          flexDirection="column"
          flex={1}
          p={3}
        >
          <Logo />
          <Box mt={4}>
            <QueryErrorResetBoundary>
              {({ reset }) => (
                <ErrorBoundary
                  onReset={reset}
                  fallbackRender={({ resetErrorBoundary }) => (
                    <AppContainer>
                      <Typography
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        There was an error!
                        <Button
                          variant="outlined"
                          onClick={() => resetErrorBoundary()}
                        >
                          Reload
                        </Button>
                      </Typography>
                    </AppContainer>
                  )}
                >
                  <Suspense fallback={<Loading />}>
                    <Layout />
                  </Suspense>
                </ErrorBoundary>
              )}
            </QueryErrorResetBoundary>
          </Box>
        </Box>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
