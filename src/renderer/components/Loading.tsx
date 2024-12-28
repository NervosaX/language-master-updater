import { styled } from '@mui/material/styles';
import { circularProgressClasses } from '@mui/material/CircularProgress';
import { Box, CircularProgress } from '@mui/material';

const WhiteCircularProgress = styled(CircularProgress)(() => ({
  [`&.${circularProgressClasses.colorPrimary}`]: {
    color: 'white',
  },
}));

export default function Loading() {
  return (
    <Box display="flex" flex={1} justifyContent="center" alignItems="center">
      <WhiteCircularProgress />
    </Box>
  );
}
