import React from 'react';
import { Box } from '@mui/system';
import Typography from './Typography';

type Props = {
  children: React.ReactNode;
  title: string;
  sx?: object;
};

function AppContainer({ children, title, sx = {} }: Props) {
  return (
    <Box sx={sx}>
      <Typography variant="header1">{title}</Typography>
      <Box backgroundColor="#fff" borderRadius={1} p={3} mt={1}>
        {children}
      </Box>
    </Box>
  );
}

export default AppContainer;
