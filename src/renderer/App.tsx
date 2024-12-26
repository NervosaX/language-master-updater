import {
  QueryClient,
  QueryClientProvider,
  // useSuspenseQuery,
} from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
// import axios from 'axios';
import './App.css';
import { Suspense } from 'react';
import { Box, ThemeProvider } from '@mui/system';
import { createTheme } from '@mui/material/styles';

import Logo from './components/Logo';
import AppContainer from './components/AppContainer';
import Application from './components/Application';

import '@fontsource-variable/rubik';

declare module '@mui/material/styles' {
  interface TypeBackground {
    primary: string;
  }

  interface PaletteOptions {
    typography: object;
  }
}

const theme = createTheme({
  palette: {
    background: {
      primary: '#df153b',
    },
    typography: {
      header1: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 600,
      },
      header2: {
        color: '#000',
        fontSize: 20,
      },
      body1: {
        color: '#515151',
        fontSize: 14,
      },
      body2: {
        color: '#000',
        fontSize: 14,
        fontWeight: 500,
      },
    },
  },
});

const queryClient = new QueryClient();

function Layout() {
  // const { data: latestVersion } = useSuspenseQuery({
  //   queryKey: ['languageMaster', 'versions'],
  //   queryFn: async () => {
  //     const { data } = await axios.get(
  //       'https://languagemaster.io/api/latest-version',
  //     );
  //     return data;
  //   },
  // });
  //
  return (
    <Box
      backgroundColor="background.primary"
      display="flex"
      flexDirection="column"
      flex={1}
      p={3}
    >
      <Logo />

      <AppContainer title="Installed" sx={{ mt: 4 }}>
        <Application
          currentVersion="2.0.123"
          latestVersion="2.0.199"
          title="Rooster Video Tools"
        />
        <Application
          sx={{ mt: 4 }}
          currentVersion="3.1.123"
          latestVersion="3.1.123"
          title="Some other thing"
        />
      </AppContainer>
      <AppContainer title="Not installed" sx={{ mt: 4 }}>
        <Application latestVersion="1.0.333" title="Rooster MasterLingQ" />
      </AppContainer>
    </Box>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <ThemeProvider theme={theme}>
          <Suspense fallback={<div>Loading</div>}>
            <Layout />
          </Suspense>
        </ThemeProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
