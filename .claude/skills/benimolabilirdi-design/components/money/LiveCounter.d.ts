import React from "react";
export interface LiveCounterProps {
  value: number;
  label?: string;
  tickInterval?: number;
  style?: React.CSSProperties;
}
export function LiveCounter(props: LiveCounterProps): JSX.Element;
