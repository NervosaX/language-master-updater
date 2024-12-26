import React from 'react';
import { Box } from '@mui/system';

type Props = {
  children: React.ReactNode | string;
  variant?: string;
  sx?: object;
};

function Typography({ children, sx = {}, variant = 'body1' }: Props) {
  return (
    <Box
      sx={(theme) => {
        return { ...theme.palette.typography[variant], ...sx };
      }}
    >
      {children}
    </Box>
  );
}

export default Typography;
