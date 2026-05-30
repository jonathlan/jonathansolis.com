"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";

interface ScrollContextType {
  activeSection: number;
  setActiveSection: (index: number) => void;
  scrollToSection: (index: number) => void;
  isTransitioning: boolean;
}

const ScrollContext = createContext<ScrollContextType>({
  activeSection: 0,
  setActiveSection: () => {},
  scrollToSection: () => {},
  isTransitioning: false,
});

export function ScrollProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToSection = useCallback((index: number) => {
    setIsTransitioning(true);
    setActiveSection(index);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsTransitioning(false), 1100);
  }, []);

  return (
    <ScrollContext.Provider
      value={{ activeSection, setActiveSection, scrollToSection, isTransitioning }}
    >
      {children}
    </ScrollContext.Provider>
  );
}

export const useScroll = () => useContext(ScrollContext);
