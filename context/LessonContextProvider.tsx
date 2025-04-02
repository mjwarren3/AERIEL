import React, { createContext, useContext, useState, ReactNode } from "react";

interface LessonContextType {
  isContinueEnabled: boolean;
  setContinueEnabled: (enabled: boolean) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

const LessonContext = createContext<LessonContextType | undefined>(undefined);

export const LessonContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isContinueEnabled, setContinueEnabled] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <LessonContext.Provider
      value={{
        isContinueEnabled,
        setContinueEnabled,
        currentIndex,
        setCurrentIndex,
      }}
    >
      {children}
    </LessonContext.Provider>
  );
};

export const useLessonContext = () => {
  const context = useContext(LessonContext);
  if (!context) {
    throw new Error(
      "useLessonContext must be used within a LessonContextProvider"
    );
  }
  return context;
};
