import { createContext } from "react";

export const OverlayContext = createContext({
  showOverlay: () => {},
  hideOverlay: () => {},
});