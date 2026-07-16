import React from "react";
export interface SparkleBurstProps {
  /** Increment/change this value to fire a sparkle burst. */
  trigger?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export function SparkleBurst(props: SparkleBurstProps): JSX.Element;
