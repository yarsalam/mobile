import React from "react";
import GlobalText from "./GlobalText";
import { useTheme } from "../context/MainContext";


export const ThemedArrowDownIcon: React.FC = () => {
  const {theme} = useTheme();
  return <GlobalText style={{color: theme.colors.text}}>▼</GlobalText>;
};
export const ThemedArrowUpIcon: React.FC = () => {
  const {theme} = useTheme();
  return <GlobalText style={{color: theme.colors.text}}>▲</GlobalText>;
};
export const ThemedTickIcon: React.FC = () => {
  const {theme} = useTheme();
  return <GlobalText style={{color: theme.colors.primary}}>✔</GlobalText>;
};
export const ThemedCloseIcon: React.FC = () => {
  const {theme} = useTheme();
  return <GlobalText style={{color: theme.colors.primary}}>✕</GlobalText>;
};
