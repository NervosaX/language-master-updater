import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypeBackground {
    primary: string;
  }

  interface PaletteOptions {
    typography: object;
  }
}

export default createTheme({
  palette: {
    primary: {
      main: '#df153b',
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
        fontWeight: 500,
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
      subheader: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 500,
      },
    },
  },
});
