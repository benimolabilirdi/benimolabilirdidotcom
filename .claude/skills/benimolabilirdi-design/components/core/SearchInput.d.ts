import React from "react";
export interface SearchInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}
export function SearchInput(props: SearchInputProps): JSX.Element;
