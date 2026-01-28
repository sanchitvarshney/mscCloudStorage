import { useContext } from "react";
import {
  ToastCreateContext,
  type ToastContextProps,
} from "../context/ToastContext";

export const useToast = (): ToastContextProps => {
  const context = useContext(ToastCreateContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
