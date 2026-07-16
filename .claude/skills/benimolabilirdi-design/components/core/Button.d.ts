import React from "react";
export interface ButtonProps {
  children?: React.ReactNode;
  /** Visual intent. `primary`=coral CTA, `positive`=green confirm. */
  variant?: "primary" | "positive" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
}
export function Button(props: ButtonProps): JSX.Element;
