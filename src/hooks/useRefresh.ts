import { useCallback, useState } from "react";

export const useRefresh = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const refreshWithDelay = useCallback(
    (delay: number = 1500) => {
      setTimeout(() => {
        refresh();
      }, delay);
    },
    [refresh]
  );

  return {
    refreshKey,
    refresh,
    refreshWithDelay,
  };
};
