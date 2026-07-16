import React from "react";
export interface ChipProps {
  children?: React.ReactNode;
  emoji?: string;
  selected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
export function Chip(props: ChipProps): JSX.Element;
