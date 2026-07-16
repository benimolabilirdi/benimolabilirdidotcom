import React from "react";
export interface CategoryTileProps {
  emoji: string;
  label: string;
  selected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
export function CategoryTile(props: CategoryTileProps): JSX.Element;
