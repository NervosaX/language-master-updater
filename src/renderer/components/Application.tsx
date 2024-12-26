import { Box } from '@mui/system';
import { RefreshCw, Download } from 'lucide-react';
import { IconButton } from '@mui/material';

import Typography from './Typography';

type Props = {
  title: string;
  currentVersion?: string;
  latestVersion: string;
  sx?: object;
};

function Application({ sx, title, currentVersion, latestVersion }: Props) {
  const isInstalled = Boolean(currentVersion);
  const hasUpdate = isInstalled && currentVersion !== latestVersion;

  let icon = null;

  if (!isInstalled) {
    icon = <Download />;
  } else if (hasUpdate) {
    icon = <RefreshCw />;
  }

  return (
    <Box sx={sx}>
      <Typography variant="header2">{title}</Typography>
      <Box mt={1} display="flex">
        <Typography variant="body1" sx={{ flex: 1 }}>
          The ULTIMATE extension for language learning through video websites,
          providing powerful tools to help you learn through immersive video
          experiences.
        </Typography>
        <Box minWidth={80} display="flex" justifyContent="end">
          {icon && <IconButton>{icon}</IconButton>}
        </Box>
      </Box>
      {currentVersion && (
        <Box mt={3} display="flex">
          <Typography variant="body2" sx={{ flex: 1 }}>
            {currentVersion}
          </Typography>
          <Typography variant="body2">
            {hasUpdate ? (
              <>Verson {latestVersion} available</>
            ) : (
              <>Latest version</>
            )}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default Application;
