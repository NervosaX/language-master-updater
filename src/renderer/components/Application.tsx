import { useState, useEffect } from 'react';
import { Box } from '@mui/system';
import { RefreshCw, Download } from 'lucide-react';
import { IconButton, CircularProgress } from '@mui/material';
import Typography from './Typography';
import { useDownloadApplication } from '../queries';
import { ApplicationResponse } from '../../main/api';

type Props = ApplicationResponse & {
  sx?: object;
};

function Application({
  sx,
  title,
  description = '',
  installedVersion,
  latestVersion,
}: Props) {
  const { mutate, isPending } = useDownloadApplication(title, latestVersion);

  const isInstalled = Boolean(installedVersion);
  const hasUpdate = isInstalled && installedVersion !== latestVersion;
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);

  const handleClick = () => {
    if (!isInstalled) {
      mutate();
    }
  };

  useEffect(() => {
    window.api.onDownloadProgress((progress: number) => {
      setDownloadProgress(progress === 100 ? null : progress);
    });
  }, []);

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
          {description}
        </Typography>
        <Box minWidth={80} display="flex" justifyContent="end">
          {!isPending ? (
            icon && <IconButton onClick={handleClick}>{icon}</IconButton>
          ) : (
            <CircularProgress
              variant={downloadProgress ? 'determinate' : 'indeterminate'}
              value={downloadProgress ?? 0}
              size={30}
            />
          )}
        </Box>
      </Box>
      {installedVersion ? (
        <Box mt={3} display="flex">
          <Typography variant="body2" sx={{ flex: 1 }}>
            Version {installedVersion} installed
          </Typography>
          <Typography variant="body2">
            {hasUpdate ? (
              <>Version {latestVersion} available</>
            ) : (
              <>Up to date</>
            )}
          </Typography>
        </Box>
      ) : (
        <Box mt={1} display="flex">
          Version {latestVersion} available
        </Box>
      )}
    </Box>
  );
}

export default Application;
