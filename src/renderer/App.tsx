import './App.css';
import '@fontsource-variable/rubik';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';
import { Box, ThemeProvider } from '@mui/system';

import Logo from './components/Logo';
import Loading from './components/Loading';

import theme from './theme';
import { useDownloadPath } from './queries';
import Applications from './components/Applications';
import ChooseDirectory from './components/ChooseDirectory';
import { queryClient } from './query-client';

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
          sx={{ backgroundColor: 'background.primary' }}
          display="flex"
          flexDirection="column"
          flex={1}
          p={3}
        >
          <Logo />
          <Box mt={4}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
              <Suspense fallback={<Loading />}>
                <Layout />
              </Suspense>
            </ErrorBoundary>
          </Box>
        </Box>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
