import React from 'react';
import { Box } from '@mui/material';

type Props = {
  onClick?: Function;
  children: React.ReactNode;
  sx?: object;
};

export function Anchor({ sx, onClick = () => {}, children }: Props) {
  return (
    <Box
      component="button"
      sx={{
        background: 'none',
        border: 'none',
        padding: 0,
        color: '#fff',
        fontWeight: 500,
        fontFamily: 'Rubik Variable, sans-serif',
        textDecoration: 'underline',
        cursor: 'pointer',
        ...sx,
      }}
      onClick={() => onClick()}
    >
      {children}
    </Box>
  );
}
