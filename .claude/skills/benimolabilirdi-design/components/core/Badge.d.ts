import React from "react";
export interface BadgeProps {
  children?: React.ReactNode;
  tone?: "neutral" | "accent" | "positive" | "sparkle";
  style?: React.CSSProperties;
}
export function Badge(props: BadgeProps): JSX.Element;
