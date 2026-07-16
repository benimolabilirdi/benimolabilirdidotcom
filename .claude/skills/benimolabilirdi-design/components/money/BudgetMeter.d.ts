import React from "react";
export interface BudgetMeterProps {
  total: number;
  remaining: number;
  label?: string;
  style?: React.CSSProperties;
}
export function BudgetMeter(props: BudgetMeterProps): JSX.Element;
