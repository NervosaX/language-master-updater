import { Box } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import AppContainer from './AppContainer';
import Application from './Application';
import Typography from './Typography';

import { useApplications, useDownloadPath } from '../queries';
import { ApplicationResponse } from '../../main/api';

export default function Applications() {
  const queryClient = useQueryClient();
  const downloadPath = useDownloadPath();
  const data = useApplications();

  const installedApps = data.filter((item: ApplicationResponse) => {
    return item.installedVersion !== null;
  });

  const uninstalledApps = data.filter((item: ApplicationResponse) => {
    return item.installedVersion === null;
  });

  return (
    <>
      <Typography variant="subheader" sx={{ mb: 4 }}>
        Applications installed to directory {downloadPath}. &nbsp;
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
          }}
          onClick={async () => {
            await window.api.selectDirectory();

            // Promise above blocks this until you've selected a dir
            queryClient.invalidateQueries();
          }}
        >
          Change directory?
        </Box>
      </Typography>
      {Boolean(installedApps.length) && (
        <AppContainer title="Installed">
          {installedApps.map((item: ApplicationResponse, index: number) => {
            const { title, description, latestVersion, installedVersion } =
              item;
            return (
              <Application
                sx={{ mt: index > 0 ? 4 : 0 }}
                latestVersion={latestVersion}
                installedVersion={installedVersion}
                description={description}
                title={title}
                key={title}
              />
            );
          })}
        </AppContainer>
      )}
      {Boolean(uninstalledApps.length) && (
        <AppContainer
          title="Not installed"
          sx={{ mt: installedApps.length ? 4 : 0 }}
        >
          {uninstalledApps.map((item: ApplicationResponse, index: number) => {
            const { title, description, latestVersion, installedVersion } =
              item;
            return (
              <Application
                sx={{ mt: index > 0 ? 4 : 0 }}
                latestVersion={latestVersion}
                installedVersion={installedVersion}
                description={description}
                title={title}
                key={title}
              />
            );
          })}
        </AppContainer>
      )}
    </>
  );
}