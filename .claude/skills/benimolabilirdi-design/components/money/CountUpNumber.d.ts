import React from "react";
export interface CountUpNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  size?: string;
  color?: string;
  weight?: number;
  /** Animate from 0 on mount. */
  animate?: boolean;
  style?: React.CSSProperties;
}
export function CountUpNumber(props: CountUpNumberProps): JSX.Element;
