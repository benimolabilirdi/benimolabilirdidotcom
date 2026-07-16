import React from "react";
export interface CardProps {
  children?: React.ReactNode;
  padding?: string;
  /** Lifts on hover when true. */
  interactive?: boolean;
  tone?: "paper" | "sunken" | "navy";
  style?: React.CSSProperties;
}
export function Card(props: CardProps): JSX.Element;
