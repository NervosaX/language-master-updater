import React, { useState, useEffect } from 'react';
import { Box } from '@mui/system';
import { RefreshCw, Download } from 'lucide-react';
import {
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
} from '@mui/material';
import Typography from './Typography';
import { useDownloadApplication } from '../queries';
import { ApplicationResponse } from '../../main/api';
import { Anchor } from './Anchor';

type Props = ApplicationResponse & {
  sx?: object;
};

function Application({
  sx,
  title,
  description = '',
  installedVersion,
  latestVersion,
  patchNotes,
}: Props) {
  const { mutate, isPending } = useDownloadApplication(title, latestVersion);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [showChanges, setShowChanges] = useState<boolean>(false);

  const isInstalled = Boolean(installedVersion);
  const hasUpdate = isInstalled && installedVersion !== latestVersion;

  const handleClick = () => {
    if (!isInstalled || hasUpdate) {
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
        <Box mt={1} display="flex">
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
      <Anchor
        sx={{ color: 'black', textAlign: 'right', pt: 1 }}
        onClick={() => setShowChanges(true)}
      >
        Changelog
      </Anchor>
      <Dialog open={showChanges} onClose={() => setShowChanges(false)}>
        <DialogTitle>{title} patch notes</DialogTitle>
        <DialogContent sx={{ width: 500, height: 400, overflowY: 'auto' }}>
          {patchNotes.map(({ version, date, notes }, index) => {
            return (
              <React.Fragment key={version}>
                <Typography variant="body2" sx={{ mt: index === 0 ? 0 : 2 }}>
                  {version}{' '}
                  <Box component="span" sx={{ float: 'right' }}>
                    {date}
                  </Box>
                </Typography>
                <Box component="ul" pl={3}>
                  {notes.map((note) => {
                    return (
                      <li key={note}>
                        <Typography sx={{ mt: 1 }}>{note}</Typography>
                      </li>
                    );
                  })}
                </Box>
                {index !== patchNotes.length - 1 && (
                  <Box py={1}>
                    <Divider />
                  </Box>
                )}
              </React.Fragment>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowChanges(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Application;
