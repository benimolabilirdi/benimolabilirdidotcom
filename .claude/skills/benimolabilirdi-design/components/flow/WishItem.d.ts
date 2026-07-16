import React from "react";
export interface WishItemProps {
  emoji: string;
  name: string;
  price: number;
  qty?: number;
  onAdd?: () => void;
  onRemove?: () => void;
  style?: React.CSSProperties;
}
export function WishItem(props: WishItemProps): JSX.Element;
