import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { queryClient } from './query-client';

export function useApplications() {
  const { data } = useSuspenseQuery({
    queryKey: ['languageMaster', 'versions'],
    queryFn: async () => {
      return window.api.getApplications();
    },
  });

  return data;
}

export function useDownloadApplication(appName: string, version: string) {
  return useMutation({
    mutationFn() {
      return window.api.downloadTools(appName, version);
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['languageMaster', 'versions'],
      });
    },
  });
}

export function useDownloadPath() {
  const { data } = useSuspenseQuery({
    queryKey: ['rootDirectory'],
    queryFn() {
      return window.api.getDownloadPath();
    },
  });

  return data;
}
