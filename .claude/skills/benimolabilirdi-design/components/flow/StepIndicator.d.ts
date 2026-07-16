import React from "react";
export interface StepIndicatorProps {
  steps: number;
  current?: number;
  style?: React.CSSProperties;
}
export function StepIndicator(props: StepIndicatorProps): JSX.Element;
