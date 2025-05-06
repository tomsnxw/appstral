import React, { createContext, useRef, useContext } from 'react';

const CaptureContext = createContext(null);

export const CaptureProvider = ({ children }) => {
  const captureRef = useRef(null);

  return (
    <CaptureContext.Provider value={{ captureRef }}>
      {children}
    </CaptureContext.Provider>
  );
};

export const useCapture = () => useContext(CaptureContext);
