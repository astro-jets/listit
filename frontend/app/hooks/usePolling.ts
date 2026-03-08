import { useEffect } from "react";

export const usePolling = (callback: () => void, interval = 3000) => {
  useEffect(() => {
    const id = setInterval(callback, interval);
    return () => clearInterval(id);
  }, []);
};
