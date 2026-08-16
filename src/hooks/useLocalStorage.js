import { useCallback } from "react";
import { isDevMode } from "@/api";

const useLocalStorage = () => {
  const setItem = useCallback((key, value) => {
    try {
      if (typeof value === "object") {
        localStorage.setItem(key, JSON.stringify(value));
      } else {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      if (isDevMode)
        console.error(`useLocalStorage.setItem: failed to set "${key}"`, error);
    }
  }, []);

  const getItem = useCallback((key) => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return null;
      try {
        return JSON.parse(item);
      } catch {
        return item; // plain string, not JSON-serialised
      }
    } catch (error) {
      if (isDevMode)
        console.error(`useLocalStorage.getItem: failed to get "${key}"`, error);
      return null;
    }
  }, []);

  const removeItem = useCallback((key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      if (isDevMode)
        console.error(
          `useLocalStorage.removeItem: failed to remove "${key}"`,
          error,
        );
    }
  }, []);

  return { setItem, getItem, removeItem };
};

export { useLocalStorage };
