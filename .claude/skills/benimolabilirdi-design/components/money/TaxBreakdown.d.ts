import React from "react";
export interface TaxBreakdownProps {
  /** Total price the user paid. */
  paid: number;
  /** Tax portion of that price. */
  tax: number;
  style?: React.CSSProperties;
}
export function TaxBreakdown(props: TaxBreakdownProps): JSX.Element;
