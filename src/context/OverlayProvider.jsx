import { OverlayContext } from "@/context";
import React, { useState, useCallback } from "react";
import {AppOverlay} from "@/components";
export const OverlayProvider = ({ children }) => {
  const [overlayProps, setOverlayProps] = useState(null);

  const showOverlay = useCallback((props) => {
    setOverlayProps({ ...props, visible: true });
  }, []);

  const hideOverlay = useCallback(() => {
    setOverlayProps((prev) => (prev ? { ...prev, visible: false } : null));
  }, []);

  return (
    <OverlayContext.Provider value={{ showOverlay, hideOverlay }}>
      {children}
      {overlayProps && <AppOverlay {...overlayProps} onClose={hideOverlay} />}
    </OverlayContext.Provider>
  );
};
