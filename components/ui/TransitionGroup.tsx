"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Transition } from "./Transition";
import type { TransitionPreset } from "./Transition";

interface TransitionContextValue {
  activeKey: string;
  setActiveKey: (key: string) => void;
  preset: TransitionPreset;
  duration: number;
}

const TransitionContext = createContext<TransitionContextValue>({
  activeKey: "",
  setActiveKey: () => {},
  preset: "fade",
  duration: 250,
});

interface TransitionGroupProps {
  defaultKey: string;
  preset?: TransitionPreset;
  duration?: number;
  children: ReactNode;
}

export function TransitionGroup({
  defaultKey,
  preset = "fade",
  duration = 250,
  children,
}: TransitionGroupProps) {
  const [activeKey, setActiveKey] = useState(defaultKey);

  return (
    <TransitionContext.Provider value={{ activeKey, setActiveKey, preset, duration }}>
      {children}
    </TransitionContext.Provider>
  );
}

interface TransitionItemProps {
  id: string;
  className?: string;
  children: ReactNode;
}

export function TransitionItem({ id, className, children }: TransitionItemProps) {
  const { activeKey, preset, duration } = useContext(TransitionContext);
  return (
    <Transition show={activeKey === id} preset={preset} duration={duration} className={className}>
      {children}
    </Transition>
  );
}

export function useTransitionGroup() {
  const { activeKey, setActiveKey } = useContext(TransitionContext);
  return { activeKey, navigate: setActiveKey };
}
