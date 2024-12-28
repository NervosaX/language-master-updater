import { useQueryClient } from '@tanstack/react-query';
import { Button, Typography } from '@mui/material';

import AppContainer from './AppContainer';

export default function ChooseDirectory() {
  const queryClient = useQueryClient();

  const handleSelectDirectory = async () => {
    await window.api.selectDirectory();

    // Promise above blocks this until you've selected a dir
    queryClient.invalidateQueries();
  };

  return (
    <AppContainer>
      <Typography>
        Choose where to store your applications. You'll load the unpacked
        extensions from this directory in Chrome
      </Typography>
      <Button
        sx={{ mt: 4 }}
        variant="contained"
        color="primary"
        onClick={handleSelectDirectory}
      >
        Choose directory
      </Button>
    </AppContainer>
  );
}
